import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Encryption Utility for BVED Platform Credentials
 * 
 * Uses AES-256-GCM for authenticated encryption.
 * 
 * Why AES-256-GCM over Supabase Vault?
 * - No database extension required
 * - Works with any PostgreSQL setup
 * - Simpler deployment (no Vault setup)
 * - Good performance
 * - Industry standard (used by AWS, Google Cloud, etc.)
 * 
 * Security:
 * - 256-bit key (from environment variable)
 * - Authenticated encryption (prevents tampering)
 * - Random IV for each encryption (stored with ciphertext)
 * - Key should be rotated periodically
 */

const ENCRYPTION_KEY = process.env.BVED_CREDENTIALS_ENCRYPTION_KEY || "";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits for GCM

if (!ENCRYPTION_KEY && process.env.NODE_ENV === "production") {
  console.warn(
    "[BVED] Warning: BVED_CREDENTIALS_ENCRYPTION_KEY not set. Credentials will not be encrypted!"
  );
}

/**
 * Encrypt credentials JSON
 * 
 * Format: base64(iv + authTag + ciphertext)
 * 
 * @param plaintext - JSON string to encrypt
 * @returns Base64-encoded encrypted data
 */
export function encryptCredentials(plaintext: string): string {
  if (!ENCRYPTION_KEY) {
    // In development, return plaintext if key not set (with warning)
    if (process.env.NODE_ENV !== "production") {
      console.warn("[BVED] Encryption key not set, storing plaintext (dev only)");
      return plaintext;
    }
    throw new Error("BVED_CREDENTIALS_ENCRYPTION_KEY must be set in production");
  }

  if (ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "BVED_CREDENTIALS_ENCRYPTION_KEY must be 64 hex characters (32 bytes = 256 bits)"
    );
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine: IV (12 bytes) + AuthTag (16 bytes) + Ciphertext
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined.toString("base64");
}

/**
 * Decrypt credentials JSON
 * 
 * @param encryptedData - Base64-encoded encrypted data
 * @returns Decrypted JSON string
 */
export function decryptCredentials(encryptedData: string): string {
  if (!ENCRYPTION_KEY) {
    // In development, return as-is if key not set (might be plaintext)
    if (process.env.NODE_ENV !== "production") {
      // Try to parse as JSON - if it works, it's plaintext
      try {
        JSON.parse(encryptedData);
        return encryptedData;
      } catch {
        throw new Error("Cannot decrypt: encryption key not set and data is not plaintext JSON");
      }
    }
    throw new Error("BVED_CREDENTIALS_ENCRYPTION_KEY must be set in production");
  }

  if (ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "BVED_CREDENTIALS_ENCRYPTION_KEY must be 64 hex characters (32 bytes = 256 bits)"
    );
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const combined = Buffer.from(encryptedData, "base64");
  
  // Extract: IV (12 bytes) + AuthTag (16 bytes) + Ciphertext
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString("utf8");
}

/**
 * Generate a new encryption key (for setup)
 * 
 * Run this once to generate a key:
 * node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString("hex");
}
