export interface IPlan {
  id: number;
  tenant_id: number;
  name: string;
  duration_days: number; // in days
  price_cents: number; // stored in cents
  visit_limit?: number | null; // null = unlimited
  active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface CreatePlanInput {
  tenant_id: number;
  name: string;
  duration_days: number; // in days
  price_cents: number; // stored in cents
  visit_limit?: number | null; // null = unlimited
  active?: boolean;
}

export interface UpdatePlanInput {
  name?: string;
  duration_days?: number; // in days
  price_cents?: number; // stored in cents
  visit_limit?: number | null; // null = unlimited
  active?: boolean;
}

export class PlanModel {
  static readonly INSERT_QUERY = `
    INSERT INTO plans 
    (tenant_id, name, duration_days, price_cents, visit_limit, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  static readonly SELECT_BY_ID_QUERY = `
    SELECT * FROM plans
    WHERE id = ? AND tenant_id = ?
    LIMIT 1
    `;

  static readonly SELECT_ALL_BY_TENANT_QUERY = `
    SELECT * FROM plans
    WHERE tenant_id = ?
    ORDER BY created_at DESC
    `;

  static readonly UPDATE_QUERY = `
    UPDATE plans SET name = ?, duration_days = ?, price_cents = ?, visit_limit = ?, active = ?
    WHERE id = ? AND tenant_id = ?
    `;

  static readonly DELETE_QUERY = `
    DELETE FROM plans
    WHERE id = ? AND tenant_id = ?
    `;
}
