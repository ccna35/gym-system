import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Missing Authorization header" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;

    return next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

// requireAdmin middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role_id !== 1) {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  return next();
}
