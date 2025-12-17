import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends JwtPayload {
  user?: {
    id: string;
    username: string;
    roles: string[]; // atau string[]
  };
}
