import { executeQuery } from "../db/connection";
import {
  IMembership,
  CreateMembershipInput,
  UpdateMembershipInput,
  MembershipModel,
} from "../models/Membership";

export class MembershipService {
  static async create(input: CreateMembershipInput): Promise<IMembership> {
    // Make sure the member does not already have an active or pending membership
    const existingMemberships = await executeQuery(
      `SELECT * FROM memberships WHERE member_id = ? AND tenant_id = ? AND status IN ('ACTIVE', 'PENDING')`,
      [input.member_id, input.tenant_id]
    );
    if (existingMemberships.length > 0) {
      throw new Error("Member already has an active or pending membership");
    }
    const result = await executeQuery(MembershipModel.INSERT_QUERY, [
      input.tenant_id,
      input.member_id,
      input.plan_id ?? null,
      input.start_date,
      input.start_date,
      input.price * 100, // Store price in cents
      input.status ?? "ACTIVE",
      input.notes ?? null,
      input.created_by,
    ]);
    const rows = await executeQuery(MembershipModel.SELECT_BY_ID_QUERY, [
      result.insertId,
      input.tenant_id,
    ]);
    return rows[0] as IMembership;
  }

  static async getById(
    id: number,
    tenant_id: number
  ): Promise<IMembership | null> {
    const rows = await executeQuery(MembershipModel.SELECT_BY_ID_QUERY, [
      id,
      tenant_id,
    ]);
    return rows && rows.length ? (rows[0] as IMembership) : null;
  }

  static async getAll(tenant_id: number): Promise<IMembership[]> {
    const rows = await executeQuery(
      MembershipModel.SELECT_ALL_BY_TENANT_QUERY,
      [tenant_id]
    );
    return rows as IMembership[];
  }

  static async getAllByMember(
    member_id: number,
    tenant_id: number
  ): Promise<IMembership[]> {
    const rows = await executeQuery(
      MembershipModel.SELECT_ALL_BY_MEMBER_QUERY,
      [member_id, tenant_id]
    );
    return rows as IMembership[];
  }

  static async update(
    id: number,
    tenant_id: number,
    input: UpdateMembershipInput
  ): Promise<IMembership | null> {
    const current = await this.getById(id, tenant_id);
    if (!current) return null;
    await executeQuery(MembershipModel.UPDATE_QUERY, [
      input.plan_id ?? current.plan_id ?? null,
      input.start_date ?? current.start_date,
      input.end_date ?? current.end_date,
      input.price_cents ?? current.price_cents,
      input.status ?? current.status,
      input.notes ?? current.notes ?? null,
      id,
      tenant_id,
    ]);
    return this.getById(id, tenant_id);
  }

  static async delete(id: number, tenant_id: number): Promise<boolean> {
    const result = await executeQuery(MembershipModel.DELETE_QUERY, [
      id,
      tenant_id,
    ]);
    return result.affectedRows > 0;
  }
}
