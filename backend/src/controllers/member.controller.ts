import { Request, Response } from "express";
import { MemberService } from "../services/member.service";

import { MembershipService } from "../services/membership.service";
import { PaymentService } from "../services/payment.service";

export class MemberController {
  static async create(req: Request, res: Response) {
    try {
      const tenant_id = req.user?.tenant_id;
      const member = await MemberService.create({ ...req.body, tenant_id });
      res.status(201).json({ success: true, data: member });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create member",
      });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id, tenant_id } = req.params;
    const member = await MemberService.getById(Number(id), Number(tenant_id));
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res.json({ success: true, data: member });
  }

  static async getAll(req: Request, res: Response) {
    const tenant_id = req.user?.tenant_id;
    const members = await MemberService.getAll(Number(tenant_id));
    res.json({ success: true, data: members });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = req.user?.tenant_id;
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
    const { id, tenant_id } = req.params;
    const deleted = await MemberService.delete(Number(id), Number(tenant_id));
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Member not found or already deleted",
      });
    }
    res.json({ success: true, message: "Member deleted" });
  }

  // New: Get member details with memberships, payments, and stats
  static async getDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenant_id = req.user?.tenant_id;
      const member = await MemberService.getById(Number(id), Number(tenant_id));
      if (!member) {
        return res
          .status(404)
          .json({ success: false, message: "Member not found" });
      }

      // Get all memberships for this member
      const memberships = await MembershipService.getAllByMember(
        Number(id),
        Number(tenant_id)
      );

      // For each membership, get payments and calculate paid/remaining
      const membershipsWithPayments = await Promise.all(
        memberships.map(async (membership) => {
          const payments = await PaymentService.getAllByMembership(
            membership.id,
            membership.tenant_id
          );
          const paid =
            payments
              .filter((p) => p.status === "PAID")
              .reduce((sum, p) => sum + p.amount_cents, 0) / 100;
          const remaining = membership.price_cents / 100 - paid;
          return {
            ...membership,
            payments,
            paid,
            remaining,
          };
        })
      );

      let totalPaid = membershipsWithPayments.reduce(
        (sum, m) => sum + m.paid,
        0
      );
      let totalRemaining = membershipsWithPayments.reduce(
        (sum, m) => sum + m.remaining,
        0
      );

      res.json({
        success: true,
        data: {
          member,
          memberships: membershipsWithPayments,
          stats: {
            totalPaid,
            totalRemaining,
          },
        },
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message || "Failed to get member details",
      });
    }
  }
}
