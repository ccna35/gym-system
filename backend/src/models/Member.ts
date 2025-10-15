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
    SELECT 
        m.*,
        COALESCE(
          SUM(
            ms.price_cents - COALESCE(
              (SELECT SUM(p.amount_cents) 
               FROM payments p 
               WHERE p.membership_id = ms.id 
               AND p.status = 'PAID'),
              0
            )
           ) / 100,
          0
        ) as remaining_amount
      FROM members m
      LEFT JOIN memberships ms ON ms.member_id = m.id AND ms.tenant_id = m.tenant_id
      WHERE m.tenant_id = ?
      GROUP BY m.id
  `;

  static readonly UPDATE_MEMBER = `
    UPDATE members SET full_name = ?, email = ?, phone = ?, dob = ?, emergency_contact = ?, medical_notes = ?, photo_url = ?, status = ?
    WHERE id = ? AND tenant_id = ?
  `;

  static readonly DELETE_MEMBER = `
    DELETE FROM members WHERE id = ? AND tenant_id = ?
  `;
}
