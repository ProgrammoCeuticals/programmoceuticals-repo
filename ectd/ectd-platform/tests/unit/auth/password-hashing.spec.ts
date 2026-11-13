/**
 * Unit tests — Password hashing (Argon2id)
 * spec §40, §49.
 *
 * Verifies:
 *   + Argon2id hashes are not equal to plaintext
 *   + verify returns true for correct password
 *   - verify returns false for wrong password
 *   - two hashes of the same password are not equal (salted)
 */

import * as argon2 from "argon2";

describe("Password hashing — Argon2id (spec §40)", () => {
  const password = "TestPassword!2024";

  it("should produce a hash that does not equal the plaintext password", async () => {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(30);
  });

  it("should verify correctly against the original password", async () => {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const valid = await argon2.verify(hash, password);
    expect(valid).toBe(true);
  });

  it("should fail verification for a wrong password", async () => {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const valid = await argon2.verify(hash, "WrongPassword!");
    expect(valid).toBe(false);
  });

  it("should produce different hashes for the same password (salted)", async () => {
    const hash1 = await argon2.hash(password, { type: argon2.argon2id });
    const hash2 = await argon2.hash(password, { type: argon2.argon2id });
    expect(hash1).not.toBe(hash2);
  });

  it("should use argon2id type — not argon2i or argon2d", async () => {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    // Argon2id hashes start with $argon2id$
    expect(hash).toMatch(/^\$argon2id\$/);
  });
});
