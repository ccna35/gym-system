export type MemberStatus = "ACTIVE" | "EXPIRED" | "SUSPENDED";

export interface IMember {
  id: number;
  tenant_id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  dob?: string | null; // ISO date string
  emergency_contact?: string | null;
  medical_notes?: string | null;
  photo_url?: string | null;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateMemberInput {
  tenant_id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  emergency_contact?: string | null;
  medical_notes?: string | null;
  photo_url?: string | null;
  status?: MemberStatus;
}

export interface UpdateMemberInput {
  full_name?: string;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  emergency_contact?: string | null;
  medical_notes?: string | null;
  photo_url?: string | null;
  status?: MemberStatus;
}

export class MemberModel {
  static readonly INSERT_MEMBER = `
    INSERT INTO members (tenant_id, full_name, email, phone, dob, emergency_contact, medical_notes, photo_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_MEMBER_BY_ID = `
    SELECT * FROM members WHERE id = ? AND tenant_id = ? LIMIT 1
  `;

  static readonly SELECT_MEMBERS_BY_TENANT = `
    SELECT * FROM members WHERE tenant_id = ? ORDER BY created_at DESC
  `;

  static readonly UPDATE_MEMBER = `
    UPDATE members SET full_name = ?, email = ?, phone = ?, dob = ?, emergency_contact = ?, medical_notes = ?, photo_url = ?, status = ?
    WHERE id = ? AND tenant_id = ?
  `;

  static readonly DELETE_MEMBER = `
    DELETE FROM members WHERE id = ? AND tenant_id = ?
  `;
}
