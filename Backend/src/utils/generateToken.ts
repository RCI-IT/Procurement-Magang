import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export function generateToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET ?? "defaultsecret";

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES as SignOptions["expiresIn"] || "1d",
  };

  return jwt.sign(payload, secret, options);
}
