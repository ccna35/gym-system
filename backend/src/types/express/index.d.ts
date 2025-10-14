import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: number;
        tenant_id: number;
        email: string;
        role_id: number;
      };
    }
  }
}
