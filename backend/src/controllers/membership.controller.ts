import { Request, Response } from "express";
import { MembershipService } from "../services/membership.service";

export class MembershipController {
  static async create(req: Request, res: Response) {
    try {
      const created_by = req.user?.sub;
      const tenant_id = req.user?.tenant_id;
      const membership = await MembershipService.create({
        ...req.body,
        created_by,
        tenant_id,
      });
      res.status(201).json({ success: true, data: membership });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create membership",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = req.user?.tenant_id;
    const membership = await MembershipService.getById(
      Number(id),
      Number(tenant_id)
    );
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }
    res.json({ success: true, data: membership });
  }

  static async getAll(req: Request, res: Response) {
    const tenant_id = req.user?.tenant_id;
    const memberships = await MembershipService.getAll(Number(tenant_id));
    res.json({ success: true, data: memberships });
  }

  static async getAllByMember(req: Request, res: Response) {
    const { id: member_id } = req.params;
    const tenant_id = req.user?.tenant_id;
    const memberships = await MembershipService.getAllByMember(
      Number(member_id),
      Number(tenant_id)
    );
    res.json({ success: true, data: memberships });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = req.user?.tenant_id;
    const updated = await MembershipService.update(
      Number(id),
      Number(tenant_id),
      req.body
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }
    res.json({ success: true, data: updated });
  }

  static async delete(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const deleted = await MembershipService.delete(
      Number(id),
      Number(tenant_id)
    );
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Membership not found or already deleted",
      });
    }
    res.json({ success: true, message: "Membership deleted" });
  }
}
