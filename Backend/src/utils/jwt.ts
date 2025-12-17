import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: string;
  username: string;
  roles: string[];
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as AuthPayload;
}
