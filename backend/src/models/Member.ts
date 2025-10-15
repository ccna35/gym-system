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
        ) as remaining_amount,
         CASE
          WHEN NOW() > end_date THEN 'EXPIRED'
          WHEN end_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 'EXPIRING_SOON'
          ELSE 'ACTIVE'
         END AS membership_status
      FROM members m
      LEFT JOIN (
  SELECT t.*,
         ROW_NUMBER() OVER (
           PARTITION BY t.member_id
           ORDER BY t.created_at DESC, t.id DESC
         ) AS rn
  FROM memberships t
) AS ms ON ms.member_id = m.id AND ms.tenant_id = m.tenant_id AND ms.rn = 1
      WHERE m.tenant_id = ?
      GROUP BY m.id, membership_status;
  `;

  static readonly UPDATE_MEMBER = `
    UPDATE members SET full_name = ?, email = ?, phone = ?, dob = ?, emergency_contact = ?, medical_notes = ?, photo_url = ?, status = ?
    WHERE id = ? AND tenant_id = ?
  `;

  static readonly DELETE_MEMBER = `
    DELETE FROM members WHERE id = ? AND tenant_id = ?
  `;
}
