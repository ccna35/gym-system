import { executeQuery } from "../db/connection";
import {
  IMember,
  CreateMemberInput,
  UpdateMemberInput,
  MemberModel,
} from "../models/Member";

export class MemberService {
  static async create(input: CreateMemberInput): Promise<IMember> {
    const result = await executeQuery(MemberModel.INSERT_MEMBER, [
      input.tenant_id,
      input.full_name,
      input.email ?? null,
      input.phone ?? null,
      input.dob ?? null,
      input.emergency_contact ?? null,
      input.medical_notes ?? null,
      input.photo_url ?? null,
      input.status ?? "ACTIVE",
    ]);
    const memberRows = await executeQuery(MemberModel.SELECT_MEMBER_BY_ID, [
      result.insertId,
      input.tenant_id,
    ]);
    return memberRows[0] as IMember;
  }

  static async getById(id: number, tenant_id: number): Promise<IMember | null> {
    const rows = await executeQuery(MemberModel.SELECT_MEMBER_BY_ID, [
      id,
      tenant_id,
    ]);
    return rows && rows.length ? (rows[0] as IMember) : null;
  }

  static async getAll(tenant_id: number): Promise<IMember[]> {
    const rows = await executeQuery(MemberModel.SELECT_MEMBERS_BY_TENANT, [
      tenant_id,
    ]);
    return rows as IMember[];
  }

  static async update(
    id: number,
    tenant_id: number,
    input: UpdateMemberInput
  ): Promise<IMember | null> {
    const member = await this.getById(id, tenant_id);
    if (!member) return null;
    await executeQuery(MemberModel.UPDATE_MEMBER, [
      input.full_name ?? member.full_name,
      input.email ?? member.email,
      input.phone ?? member.phone,
      input.dob ?? member.dob,
      input.emergency_contact ?? member.emergency_contact,
      input.medical_notes ?? member.medical_notes,
      input.photo_url ?? member.photo_url,
      input.status ?? member.status,
      id,
      tenant_id,
    ]);
    return this.getById(id, tenant_id);
  }

  static async delete(id: number, tenant_id: number): Promise<boolean> {
    const result = await executeQuery(MemberModel.DELETE_MEMBER, [
      id,
      tenant_id,
    ]);
    return result.affectedRows > 0;
  }
}
