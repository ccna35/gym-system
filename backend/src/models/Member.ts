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
    SELECT m.*, 
      DATE_FORMAT(m.dob, '%Y-%m-%d') as dob
    FROM members m WHERE id = ? AND tenant_id = ? LIMIT 1
  `;

  static readonly SELECT_MEMBERS_BY_TENANT = `
    SELECT 
    m.*,
    DATE_FORMAT(m.dob, '%Y-%m-%d') as dob,
    -- Total price of all active/expired memberships
    COALESCE(SUM(ms.price_cents), 0) / 100 as total_memberships_price,
    -- Total paid across all memberships
    COALESCE(SUM(payments_total.total_paid), 0) / 100 as total_paid,
    -- Remaining amount (total price - total paid)
    (COALESCE(SUM(ms.price_cents), 0) - COALESCE(SUM(payments_total.total_paid), 0)) / 100 as remaining_amount,
    -- Latest membership status
    CASE
        WHEN MAX(ms.end_date) < NOW() THEN 'EXPIRED'
        WHEN MAX(ms.end_date) <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 'EXPIRING_SOON'
        ELSE 'ACTIVE'
    END AS membership_status,
    MAX(ms.end_date) AS expiration_date
FROM members m
LEFT JOIN memberships ms ON m.id = ms.member_id 
    AND ms.tenant_id = m.tenant_id 
    AND ms.status IN ('ACTIVE', 'EXPIRED')  -- Only active and expired
LEFT JOIN (
    SELECT 
        membership_id,
        SUM(amount_cents) as total_paid
    FROM payments
    WHERE status = 'PAID'
    GROUP BY membership_id
) payments_total ON payments_total.membership_id = ms.id
WHERE m.tenant_id = ?
GROUP BY m.id
ORDER BY m.created_at DESC;
  `;

  static readonly UPDATE_MEMBER = `
    UPDATE members SET full_name = ?, email = ?, phone = ?, dob = ?, emergency_contact = ?, medical_notes = ?, photo_url = ?, status = ?
    WHERE id = ? AND tenant_id = ?
  `;

  static readonly DELETE_MEMBER = `
    DELETE FROM members WHERE id = ? AND tenant_id = ?
  `;
}
