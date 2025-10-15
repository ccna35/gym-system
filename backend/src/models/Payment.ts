export type PaymentMethod = "CASH";
export type PaymentStatus = "PAID" | "VOID";

export interface IPayment {
  id: number;
  tenant_id: number;
  membership_id: number;
  amount_cents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string | null;
  created_by: number;
  created_at: string;
}

export interface CreatePaymentInput {
  tenant_id: number;
  membership_id: number;
  amount: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  notes?: string | null;
  created_by: number;
}

export class PaymentModel {
  static readonly INSERT_QUERY = `
    INSERT INTO payments
    (tenant_id, membership_id, amount_cents, method, status, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_BY_ID = `
    SELECT * FROM payments WHERE id = ? AND tenant_id = ? LIMIT 1
  `;

  static readonly SELECT_BY_TENANT = `
    SELECT p.id, p.tenant_id, p.membership_id, p.amount_cents / 100 AS amount, p.method, p.status, p.notes, 
      DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      mem.full_name AS member_name,
      creator.full_name AS created_by_name
    FROM payments p
    JOIN memberships m ON p.membership_id = m.id
    JOIN members mem ON m.member_id = mem.id
    JOIN users creator ON p.created_by = creator.id
    WHERE p.tenant_id = ? 
    ORDER BY p.created_at DESC
  `;

  static readonly SELECT_BY_MEMBERSHIP = `
    SELECT * FROM payments WHERE membership_id = ? AND tenant_id = ? ORDER BY created_at DESC
  `;

  static readonly DELETE_QUERY = `
    DELETE FROM payments WHERE id = ? AND tenant_id = ?
  `;
}
