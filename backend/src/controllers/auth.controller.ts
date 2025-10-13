import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: { user, token } });
    } catch (error: any) {
      if (error.message === "Email already registered") {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.status(200).json({ success: true, data: { user, token } });
    } catch (error: any) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  }
}
