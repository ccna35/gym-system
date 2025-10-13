import { Request, Response } from "express";
import { MemberService } from "../services/member.service";

export class MemberController {
  static async create(req: Request, res: Response) {
    try {
      const member = await MemberService.create(req.body);
      res.status(201).json({ success: true, data: member });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create member",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id, tenant_id } = req.params as any;
    const member = await MemberService.getById(Number(id), Number(tenant_id));
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res.json({ success: true, data: member });
  }

  static async getAll(req: Request, res: Response) {
    const { tenant_id } = req.query as any;
    const members = await MemberService.getAll(Number(tenant_id));
    res.json({ success: true, data: members });
  }

  static async update(req: Request, res: Response) {
    const { id, tenant_id } = req.params as any;
    const updated = await MemberService.update(
      Number(id),
      Number(tenant_id),
      req.body
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res.json({ success: true, data: updated });
  }

  static async delete(req: Request, res: Response) {
    const { id, tenant_id } = req.params as any;
    const deleted = await MemberService.delete(Number(id), Number(tenant_id));
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Member not found or already deleted",
      });
    }
    res.json({ success: true, message: "Member deleted" });
  }
}
