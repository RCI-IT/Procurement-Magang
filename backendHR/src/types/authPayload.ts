import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: string
  username : string;
  roles: string[]; // atau string[]
}
