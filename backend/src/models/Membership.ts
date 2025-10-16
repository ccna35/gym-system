export type MembershipStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface IMembership {
  id: number;
  tenant_id: number;
  member_id: number;
  plan_id?: number | null;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  price_cents: number;
  status: MembershipStatus;
  notes?: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMembershipInput {
  tenant_id: number;
  member_id: number;
  plan_id?: number | null;
  start_date: string;
  price: number;
  status?: MembershipStatus;
  notes?: string | null;
  created_by: number;
}

export interface UpdateMembershipInput {
  plan_id?: number | null;
  start_date?: string;
  end_date?: string;
  price_cents?: number;
  status?: MembershipStatus;
  notes?: string | null;
}

export class MembershipModel {
  static readonly INSERT_QUERY = `
    INSERT INTO memberships
      (tenant_id, member_id, plan_id, start_date, end_date, price_cents, status, notes, created_by)
    VALUES
      (?, ?, ?, ?, DATE_ADD(?, INTERVAL 30 DAY), ?, ?, ?, ?);
  `;

  static readonly SELECT_BY_ID_QUERY = `
    SELECT * FROM memberships WHERE id = ? AND tenant_id = ? LIMIT 1
  `;

  // Convert amount from cents to dollars
  static readonly SELECT_ALL_BY_TENANT_QUERY = `
    SELECT memberships.id, start_date, end_date, 
    price_cents / 100 AS price, 
    FORMAT(price_cents / 100, 2) AS price,
    notes, created_by, memberships.created_at,
    CASE
          WHEN NOW() > end_date THEN 'EXPIRED'
          WHEN end_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 'EXPIRING_SOON'
          ELSE 'ACTIVE'
         END AS status,
     full_name AS member_name
    FROM memberships
      Join members on memberships.member_id = members.id
     WHERE memberships.tenant_id = ? ORDER BY memberships.created_at DESC 
  `;

  static readonly SELECT_ALL_BY_MEMBER_QUERY = `
    SELECT * FROM memberships WHERE member_id = ? AND tenant_id = ? ORDER BY created_at DESC
  `;

  static readonly UPDATE_QUERY = `
    UPDATE memberships SET plan_id = ?, start_date = ?, end_date = ?, price_cents = ?, status = ?, notes = ?
    WHERE id = ? AND tenant_id = ?
  `;

  static readonly DELETE_QUERY = `
    DELETE FROM memberships WHERE id = ? AND tenant_id = ?
  `;

  static readonly GET_ACTIVE_OR_PENDING_BY_MEMBER_QUERY = `SELECT * FROM memberships WHERE member_id = ? AND tenant_id = ? AND status IN ('ACTIVE', 'PENDING')`;
}
