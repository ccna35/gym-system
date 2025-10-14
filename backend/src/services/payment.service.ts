import { executeQuery } from "../db/connection";
import { IPayment, CreatePaymentInput, PaymentModel } from "../models/Payment";
import { MembershipService } from "./membership.service";

export class PaymentService {
  static async create(input: CreatePaymentInput): Promise<IPayment> {
    // Check if membership exists and belongs to the tenant and is ACTIVE or PENDING
    const membership = await MembershipService.getById(
      input.membership_id,
      input.tenant_id
    );
    if (!membership || !["ACTIVE", "PENDING"].includes(membership.status)) {
      throw new Error("Invalid or inactive membership");
    }
    // Check if this membership still has remaining balance
    const payments = await this.getAllByMembership(
      input.membership_id,
      input.tenant_id
    );
    const totalPaidCents = payments.reduce((sum, p) => sum + p.amount_cents, 0);

    if (totalPaidCents + input.amount_cents > membership.price_cents) {
      throw new Error("Payment exceeds membership price");
    }

    // Create the payment
    const result = await executeQuery(PaymentModel.INSERT_QUERY, [
      input.tenant_id,
      input.membership_id,
      input.amount_cents,
      input.method ?? "CASH",
      input.status ?? "PAID",
      input.notes ?? null,
      input.created_by,
    ]);
    const rows = await executeQuery(PaymentModel.SELECT_BY_ID, [
      result.insertId,
      input.tenant_id,
    ]);
    return rows[0] as IPayment;
  }

  static async getById(
    id: number,
    tenant_id: number
  ): Promise<IPayment | null> {
    const rows = await executeQuery(PaymentModel.SELECT_BY_ID, [id, tenant_id]);
    return rows && rows.length ? (rows[0] as IPayment) : null;
  }

  static async getAll(tenant_id: number): Promise<IPayment[]> {
    console.log("tenant_id", tenant_id);

    const rows = await executeQuery(PaymentModel.SELECT_BY_TENANT, [tenant_id]);
    return rows as IPayment[];
  }

  static async getAllByMembership(
    membership_id: number,
    tenant_id: number
  ): Promise<IPayment[]> {
    // Ensure the membership exists and belongs to the tenant
    const membership = await MembershipService.getById(
      membership_id,
      tenant_id
    );

    if (!membership) {
      throw new Error("Membership not found");
    }

    const allPayments = await executeQuery(PaymentModel.SELECT_BY_MEMBERSHIP, [
      membership_id,
      tenant_id,
    ]);
    return allPayments as IPayment[];
  }

  static async delete(id: number, tenant_id: number): Promise<boolean> {
    const result = await executeQuery(PaymentModel.DELETE_QUERY, [
      id,
      tenant_id,
    ]);
    return result.affectedRows > 0;
  }
}
