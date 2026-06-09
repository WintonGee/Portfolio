import { describe, it, expect } from "vitest";
import { decodeJwtPayload, validateAccessClaims } from "./jwt";

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

describe("decodeJwtPayload", () => {
  it("decodes the payload segment", () => {
    const token = `x.${b64url({ email: "a@b.com", exp: 99 })}.y`;
    expect(decodeJwtPayload(token)).toEqual({ email: "a@b.com", exp: 99 });
  });
  it("throws on malformed tokens", () => {
    expect(() => decodeJwtPayload("nope")).toThrow();
  });
});

describe("validateAccessClaims", () => {
  const base = {
    aud: ["APP_AUD"],
    email: "wintongee@gmail.com",
    exp: 2000,
  };
  const opts = { aud: "APP_AUD", email: "wintongee@gmail.com", now: 1000 };

  it("accepts a valid payload", () => {
    expect(validateAccessClaims(base, opts).ok).toBe(true);
  });
  it("rejects a wrong email", () => {
    expect(validateAccessClaims({ ...base, email: "evil@x.com" }, opts).ok).toBe(false);
  });
  it("rejects a wrong audience", () => {
    expect(validateAccessClaims({ ...base, aud: ["OTHER"] }, opts).ok).toBe(false);
  });
  it("rejects an expired token", () => {
    expect(validateAccessClaims({ ...base, exp: 500 }, opts).ok).toBe(false);
  });
  it("accepts a string aud equal to the app aud", () => {
    expect(validateAccessClaims({ ...base, aud: "APP_AUD" }, opts).ok).toBe(true);
  });
});
