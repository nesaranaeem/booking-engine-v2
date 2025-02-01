// utils/generateJWT.js

import jwt from "jsonwebtoken";

export function generateJWT(payload) {
  const secretKey = process.env.TWO_C2P_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "TWO_C2P_SECRET_KEY is not defined in environment variables."
    );
  }

  // Define JWT options as per 2C2P's requirements
  const options = {
    algorithm: "HS256", // Ensure this matches 2C2P's specifications
    expiresIn: "1h", // Token validity period
  };

  return jwt.sign(payload, secretKey, options);
}
