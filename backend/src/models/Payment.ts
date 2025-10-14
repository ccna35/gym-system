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
  amount_cents: number;
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

  // convert amount from cents to dollars
  static readonly SELECT_BY_TENANT = `
    SELECT id, tenant_id, membership_id, amount_cents / 100 AS amount, method, status, notes, created_by, created_at
    FROM payments WHERE tenant_id = ? ORDER BY created_at DESC
  `;

  static readonly SELECT_BY_MEMBERSHIP = `
    SELECT * FROM payments WHERE membership_id = ? AND tenant_id = ? ORDER BY created_at DESC
  `;

  static readonly DELETE_QUERY = `
    DELETE FROM payments WHERE id = ? AND tenant_id = ?
  `;
}
