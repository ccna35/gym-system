import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: { user, token } });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === "Email already registered") {
        return res.status(409).json({ success: false, message: err.message });
      }
      res.status(400).json({
        success: false,
        message: err.message || "Registration failed",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.status(200).json({ success: true, data: { user, token } });
    } catch (error: unknown) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  }
}
