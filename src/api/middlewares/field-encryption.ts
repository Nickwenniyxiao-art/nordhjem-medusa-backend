import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const rawKey = process.env.FIELD_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("FIELD_ENCRYPTION_KEY is required");
  }

  const normalized =
    rawKey.length === 64 ? Buffer.from(rawKey, "hex") : Buffer.from(rawKey, "utf8");

  if (normalized.length === 32) {
    return normalized;
  }

  return crypto.createHash("sha256").update(rawKey).digest();
}

export function isEncrypted(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("enc::");
}

export function encryptField(value: string): string {
  if (isEncrypted(value)) {
    return value;
  }

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `enc::${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptField(value: string): string {
  if (!isEncrypted(value)) {
    return value;
  }

  const payload = value.replace("enc::", "");
  const [ivBase64, tagBase64, encryptedBase64] = payload.split(":");

  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted field format");
  }

  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivBase64, "base64"));
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
