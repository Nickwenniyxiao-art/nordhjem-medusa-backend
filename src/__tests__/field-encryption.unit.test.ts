import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import { decryptField, encryptField, isEncrypted } from "../api/middlewares/field-encryption";

describe("field encryption helpers", () => {
  const originalKey = process.env.FIELD_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.FIELD_ENCRYPTION_KEY = "12345678901234567890123456789012";
  });

  afterAll(() => {
    process.env.FIELD_ENCRYPTION_KEY = originalKey;
  });

  it("detects encrypted payload format", () => {
    expect(isEncrypted("enc::abc:def:ghi")).toBe(true);
    expect(isEncrypted("plain-text")).toBe(false);
  });

  it("encrypts and decrypts back to original content", () => {
    const value = "sensitive-data";
    const encrypted = encryptField(value);

    expect(encrypted).not.toEqual(value);
    expect(isEncrypted(encrypted)).toBe(true);
    expect(decryptField(encrypted)).toEqual(value);
  });

  it("throws when encrypted payload is malformed", () => {
    expect(() => decryptField("enc::invalid")).toThrow("Invalid encrypted field format");
  });
});
