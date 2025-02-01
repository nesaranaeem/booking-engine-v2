// utils/encryptJWE.js

import { EncryptJWT } from "jose";

/**
 * Encrypts a JWT payload into a JWE string.
 *
 * @param {Object} payload - The JWT payload to encrypt.
 * @returns {Promise<string>} - The encrypted JWE string.
 */
export async function encryptJWE(payload) {
  const secretKey = process.env.TWO_C2P_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "TWO_C2P_SECRET_KEY is not defined in environment variables."
    );
  }

  // Decode the Base64-encoded key
  const key = Buffer.from(secretKey, "base64");

  // Verify key length
  if (key.length !== 32) {
    throw new Error(
      "TWO_C2P_SECRET_KEY must be a 32-byte Base64-encoded string."
    );
  }

  console.log("Encrypting payload:", payload);

  try {
    // Create an instance of EncryptJWT with the payload object
    const jwe = await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" }) // Ensure these match 2C2P's specifications
      .setIssuedAt()
      .setExpirationTime("1h") // Token validity period
      .encrypt(key);

    console.log("Generated JWE:", jwe);

    return jwe;
  } catch (error) {
    console.error("Error encrypting JWE:", error);
    throw error; // Re-throw to be caught in the handler
  }
}
