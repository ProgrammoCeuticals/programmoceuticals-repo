/**
 * E2E smoke test — full regulatory submission flow
 * spec §49.
 *
 * Flow:
 *   create organization
 *     -> create product
 *     -> create application
 *     -> create submission
 *     -> create submission unit
 *     -> upload document
 *     -> freeze submission unit
 *     -> prepare-publication (gate check)
 *     -> verify audit history
 *     -> health check
 *
 * Requires:
 *   - Running API at API_BASE_URL (default: http://localhost:3000)
 *   - Seeded database (pnpm db:seed)
 *   - SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD set
 *
 * Run:
 *   API_BASE_URL=http://localhost:3000 \
 *   SEED_SUPER_ADMIN_EMAIL=admin@example.com \
 *   SEED_SUPER_ADMIN_PASSWORD=secret \
 *   npx jest tests/e2e/smoke.spec.ts --forceExit
 */

const BASE = process.env["API_BASE_URL"] ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env["SEED_SUPER_ADMIN_EMAIL"] ?? "";
const ADMIN_PASSWORD = process.env["SEED_SUPER_ADMIN_PASSWORD"] ?? "";
const SKIP = !ADMIN_EMAIL || !ADMIN_PASSWORD;

type JsonBody = Record<string, unknown>;

async function post(
  path: string,
  body: unknown,
  token?: string,
): Promise<{ status: number; body: JsonBody }> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as JsonBody };
}

async function get(
  path: string,
  token: string,
): Promise<{ status: number; body: JsonBody }> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, body: (await res.json()) as JsonBody };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("E2E smoke test — full submission flow (spec §49)", () => {
  let token: string;
  let orgId: string;
  let productId: string;
  let authorityId: string;
  let regionId: string;
  let standardId: string;
  let regionalSpecId: string;
  let applicationId: string;
  let submissionId: string;
  let submissionUnitId: string;
  let documentId: string;

  beforeAll(() => {
    if (SKIP) {
      console.warn(
        "SEED_SUPER_ADMIN_EMAIL / SEED_SUPER_ADMIN_PASSWORD not set — skipping E2E smoke test.",
      );
    }
  });

  it("should authenticate as super admin", async () => {
    if (SKIP) return;
    const res = await post("/auth/login", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    expect(res.status).toBe(201);
    token = (res.body as { accessToken: string }).accessToken;
    expect(token).toBeTruthy();
  });

  it("should resolve regulatory reference data (standards, regions, authorities)", async () => {
    if (SKIP || !token) return;

    const standards = await get("/regulatory/standards", token);
    expect(standards.status).toBe(200);
    const stdItems = (standards.body as { data: Array<{ id: string; name: string }> }).data;
    const ich = stdItems.find((s) => s.name.includes("ICH eCTD"));
    expect(ich).toBeDefined();
    standardId = ich!.id;

    const regions = await get("/regulatory/regions", token);
    expect(regions.status).toBe(200);
    const regionItems = (regions.body as { data: Array<{ id: string; code: string }> }).data;
    const us = regionItems.find((r) => r.code === "US");
    expect(us).toBeDefined();
    regionId = us!.id;

    const authorities = await get("/regulatory/authorities", token);
    expect(authorities.status).toBe(200);
    const authItems = (authorities.body as { data: Array<{ id: string; code: string }> }).data;
    const fda = authItems.find((a) => a.code === "FDA");
    expect(fda).toBeDefined();
    authorityId = fda!.id;
  });

  it("should create an organization", async () => {
    if (SKIP || !token) return;
    const res = await post("/organizations", { name: "E2E Test Pharma Co" }, token);
    expect(res.status).toBe(201);
    orgId = (res.body as { id: string }).id;
    expect(orgId).toBeTruthy();
  });

  it("should create a product", async () => {
    if (SKIP || !token || !orgId) return;
    const res = await post(
      "/products",
      {
        organizationId: orgId,
        productName: "E2E Test Drug",
        genericName: "testdrugin",
        dosageForm: "Tablet",
        strength: "100mg",
      },
      token,
    );
    expect(res.status).toBe(201);
    productId = (res.body as { id: string }).id;
    expect(productId).toBeTruthy();
  });

  it("should create a regional specification", async () => {
    if (SKIP || !token || !standardId || !regionId || !authorityId) return;
    const res = await post(
      "/regulatory/specifications",
      {
        name: "E2E FDA Regional Spec",
        version: "1.0",
        regionId,
        authorityId,
        ectdStandardId: standardId,
      },
      token,
    );
    expect([201, 409]).toContain(res.status);
    if (res.status === 201) {
      regionalSpecId = (res.body as { id: string }).id;
    } else {
      const specs = await get("/regulatory/specifications", token);
      const items = (specs.body as { data: Array<{ id: string; name: string }> }).data;
      regionalSpecId = items.find((s) => s.name === "E2E FDA Regional Spec")!.id;
    }
    expect(regionalSpecId).toBeTruthy();
  });

  it("should create a regulatory application", async () => {
    if (SKIP || !token || !orgId || !productId || !standardId || !regionalSpecId) return;
    const res = await post(
      "/applications",
      {
        organizationId: orgId,
        productId,
        authorityId,
        regionId,
        ectdStandardId: standardId,
        regionalSpecificationId: regionalSpecId,
        applicationType: "NDA",
      },
      token,
    );
    expect(res.status).toBe(201);
    applicationId = (res.body as { id: string }).id;
    expect(applicationId).toBeTruthy();
  });

  it("should create a submission", async () => {
    if (SKIP || !token || !applicationId) return;
    const res = await post(
      `/applications/${applicationId}/submissions`,
      { submissionType: "ORIGINAL", description: "E2E smoke test submission" },
      token,
    );
    expect(res.status).toBe(201);
    submissionId = (res.body as { id: string }).id;
    expect(submissionId).toBeTruthy();
  });

  it("should create a submission unit", async () => {
    if (SKIP || !token || !submissionId || !standardId) return;
    const res = await post(
      `/submissions/${submissionId}/submission-units`,
      {
        sequenceNumber: 1,
        ectdStandardId: standardId,
        regionalSpecificationId: regionalSpecId,
      },
      token,
    );
    expect(res.status).toBe(201);
    submissionUnitId = (res.body as { id: string }).id;
    expect(submissionUnitId).toBeTruthy();
  });

  it("should create a document", async () => {
    if (SKIP || !token) return;
    const res = await post(
      "/documents",
      {
        title: "E2E Test Module 1 Cover Letter",
        filename: "cover-letter.pdf",
        mimeType: "application/pdf",
        language: "en",
      },
      token,
    );
    expect(res.status).toBe(201);
    documentId = (res.body as { id: string }).id;
    expect(documentId).toBeTruthy();
  });

  it("should freeze the submission unit", async () => {
    if (SKIP || !token || !submissionUnitId) return;
    const res = await post(`/submission-units/${submissionUnitId}/freeze`, {}, token);
    expect(res.status).toBe(201);
    expect((res.body as { snapshotVersion: number }).snapshotVersion).toBe(1);
  });

  it("should return gate issues when preparing publication without validation", async () => {
    if (SKIP || !token || !submissionUnitId) return;
    const res = await post(
      `/submission-units/${submissionUnitId}/prepare-publication`,
      {},
      token,
    );
    expect(res.status).toBe(201);
    const body = res.body as { ready: boolean; issues: string[] };
    // Not ready — no validation run, no XML run, no CoUs, sender identity not configured
    expect(body.ready).toBe(false);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("should return audit history for the application", async () => {
    if (SKIP || !token || !applicationId) return;
    const res = await get(`/applications/${applicationId}/audit`, token);
    expect(res.status).toBe(200);
    const body = res.body as { data: unknown[] };
    expect(body.data.length).toBeGreaterThan(0);
  });

  it("should return a healthy response from /health", async () => {
    if (SKIP) return;
    const res = await fetch(`${BASE}/api/v1/health`);
    expect(res.status).toBe(200);
  });
});
