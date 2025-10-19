import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  static async create(req: Request, res: Response) {
    try {
      const tenant_id = req.user?.tenant_id;
      const created_by = req.user?.sub;
      const payment = await PaymentService.create({
        ...req.body,
        tenant_id,
        created_by,
      });
      res.status(201).json({ success: true, data: payment });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create payment",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const payment = await PaymentService.getById(Number(id), Number(tenant_id));
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }
    res.json({ success: true, data: payment });
  }

  static async getAll(req: Request, res: Response) {
    const tenant_id = req.user?.tenant_id;
    const payments = await PaymentService.getAll(Number(tenant_id));
    res.json({ success: true, data: payments });
  }

  static async getAllByMembership(req: Request, res: Response) {
    try {
      const { membership_id } = req.params;
      const tenant_id = req.user?.tenant_id;
      const payments = await PaymentService.getAllByMembership(
        Number(membership_id),
        Number(tenant_id)
      );
      res.json({ success: true, data: payments });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to retrieve payments",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const deleted = await PaymentService.delete(Number(id), Number(tenant_id));
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Payment not found or already deleted",
      });
    }
    res.json({ success: true, message: "Payment deleted" });
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const tenant_id = req.user?.tenant_id;

      if (!status || !["PAID", "VOID"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be PAID or VOID",
        });
      }

      const payment = await PaymentService.updateStatus(
        Number(id),
        Number(tenant_id),
        status
      );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({ success: true, data: payment });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to update payment status",
      });
    }
  }
}
