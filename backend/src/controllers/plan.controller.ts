import { Request, Response } from "express";
import { PlanService } from "../services/plan.service";

export class PlanController {
  static async create(req: Request, res: Response) {
    try {
      const tenant_id = req.user?.tenant_id;
      const plan = await PlanService.create({ ...req.body, tenant_id });
      res.status(201).json({ success: true, data: plan });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create plan",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const plan = await PlanService.getById(Number(id), Number(tenant_id));
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.json({ success: true, data: plan });
  }

  static async getAll(req: Request, res: Response) {
    const tenant_id = req.user?.tenant_id;
    const plans = await PlanService.getAll(Number(tenant_id));
    res.json({ success: true, data: plans });
  }

  static async update(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const updated = await PlanService.update(
      Number(id),
      Number(tenant_id),
      req.body
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.json({ success: true, data: updated });
  }

  static async delete(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const deleted = await PlanService.delete(Number(id), Number(tenant_id));
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found or already deleted" });
    }
    res.json({ success: true, message: "Plan deleted" });
  }
}
