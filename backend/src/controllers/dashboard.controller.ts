import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  static async summary(req: Request, res: Response) {
    try {
      const tenant_id = req.user?.tenant_id;
      const data = await DashboardService.getSummary(Number(tenant_id));
      res.json({ success: true, data });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to get dashboard summary",
      });
    }
  }
}
