import { NextRequest, NextResponse } from "next/server";

const RIMS_API_URL = process.env.RIMS_API_URL ?? "http://localhost:3000";
const SITE_HOSTNAME = process.env.SITE_HOSTNAME ?? "demo-rims.localhost";

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  consentGiven?: unknown;
  subject?: unknown;
}

export async function POST(request: NextRequest) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  // Server-side validation
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  if (
    !body.email ||
    typeof body.email !== "string" ||
    !body.email.includes("@")
  ) {
    return NextResponse.json(
      { message: "Valid email is required" },
      { status: 400 },
    );
  }

  if (
    !body.message ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return NextResponse.json(
      { message: "Message is required" },
      { status: 400 },
    );
  }

  if (!body.consentGiven) {
    return NextResponse.json(
      { message: "Consent is required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${RIMS_API_URL}/api/v1/public/sites/current/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Site-Hostname": SITE_HOSTNAME,
          Host: SITE_HOSTNAME,
        },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          message: body.message,
          consentGiven: body.consentGiven,
          ...(body.subject && typeof body.subject === "string"
            ? { subject: body.subject }
            : {}),
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Could not submit your message. Please try again later." },
        { status: 502 },
      );
    }

    // Never return submission data
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Network error. Please try again later." },
      { status: 503 },
    );
  }
}
