import { executeQuery } from "../db/connection";
import { CreatePlanInput, IPlan, PlanModel } from "../models/Plan";

export class PlanService {
  static async create(input: CreatePlanInput): Promise<IPlan> {
    const result = await executeQuery(PlanModel.INSERT_QUERY, [
      input.tenant_id,
      input.name,
      input.duration_days,
      input.price_cents,
      input.visit_limit ?? null,
      input.active ?? true,
    ]);
    const planRows = await executeQuery(PlanModel.SELECT_BY_ID_QUERY, [
      result.insertId,
      input.tenant_id,
    ]);
    return planRows[0] as IPlan;
  }

  static async getById(id: number, tenant_id: number): Promise<IPlan | null> {
    const rows = await executeQuery(PlanModel.SELECT_BY_ID_QUERY, [
      id,
      tenant_id,
    ]);
    return rows && rows.length ? (rows[0] as IPlan) : null;
  }

  static async getAll(tenant_id: number): Promise<IPlan[]> {
    const rows = await executeQuery(PlanModel.SELECT_ALL_BY_TENANT_QUERY, [
      tenant_id,
    ]);
    return rows as IPlan[];
  }

  static async update(
    id: number,
    tenant_id: number,
    input: Partial<CreatePlanInput>
  ): Promise<IPlan | null> {
    const plan = await this.getById(id, tenant_id);
    if (!plan) return null;
    await executeQuery(PlanModel.UPDATE_QUERY, [
      input.name ?? plan.name,
      input.duration_days ?? plan.duration_days,
      input.price_cents ?? plan.price_cents,
      input.visit_limit ?? plan.visit_limit,
      input.active ?? plan.active,
      id,
      tenant_id,
    ]);
    return this.getById(id, tenant_id);
  }

  static async delete(id: number, tenant_id: number): Promise<boolean> {
    const result = await executeQuery(PlanModel.DELETE_QUERY, [id, tenant_id]);
    return result.affectedRows > 0;
  }
}
