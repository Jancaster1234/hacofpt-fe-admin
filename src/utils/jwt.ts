// src/utils/jwt.ts
// TODO: {lv1} Delete jsonwebtoken package and @types/jsonwebtoken after integrating real backend API
import jwt, { SignOptions, Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.JWT_SECRET || "your_secret_key";

export function signToken(
  payload: object,
  expiresIn?: SignOptions["expiresIn"] // Fix type here
): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(
  token: string,
  options: jwt.VerifyOptions = {}
): any {
  try {
    return jwt.verify(token, SECRET_KEY, options);
  } catch (error) {
    return null;
  }
}
