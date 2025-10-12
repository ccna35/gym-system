import { executeQuery } from "../db/connection";
import {
  ITenant,
  ITenantCreate,
  ITenantUpdate,
  TenantModel,
} from "../models/Tenant";

export class TenantService {
  /**
   * Create a new tenant
   * @param tenantData - Data for the new tenant
   * @returns The created tenant
   */
  static async create(tenantData: ITenantCreate): Promise<ITenant> {
    try {
      const {
        name,
        code,
        subdomain,
        timezone = "UTC",
        currency = "USD",
        is_active = true,
      } = tenantData;
      const result = await executeQuery(TenantModel.INSERT_QUERY, [
        name,
        code,
        subdomain || null,
        timezone,
        currency,
        is_active,
      ]);
      const created = await this.findById(result.insertId);
      if (!created) {
        throw new Error("Failed to retrieve created tenant");
      }
      return created;
    } catch (error) {
      console.error("❌ Error creating tenant:", error);
      throw error;
    }
  }

  /**
   * Find all tenants
   * @returns List of tenants
   */
  static async findAll(): Promise<ITenant[]> {
    try {
      const rows = await executeQuery(TenantModel.SELECT_ALL_QUERY);
      return rows as ITenant[];
    } catch (error) {
      console.error("❌ Error fetching tenants:", error);
      throw error;
    }
  }

  /**
   * Find a tenant by ID
   * @param id - Tenant ID
   * @returns The tenant or null if not found
   */
  static async findById(id: number): Promise<ITenant | null> {
    try {
      const rows = await executeQuery(TenantModel.SELECT_BY_ID_QUERY, [id]);
      return rows.length > 0 ? (rows[0] as ITenant) : null;
    } catch (error) {
      console.error("❌ Error fetching tenant by ID:", error);
      throw error;
    }
  }

  /**
   * Find a tenant by code
   * @param code - Tenant code
   * @returns The tenant or null if not found
   */
  static async findByCode(code: string): Promise<ITenant | null> {
    try {
      const rows = await executeQuery(TenantModel.SELECT_BY_CODE_QUERY, [code]);
      return rows.length > 0 ? (rows[0] as ITenant) : null;
    } catch (error) {
      console.error("❌ Error fetching tenant by code:", error);
      throw error;
    }
  }

  /**
   * Update a tenant by ID
   * @param id - Tenant ID
   * @param tenantData - Data to update
   * @returns The updated tenant or null if not found
   */
  static async update(
    id: number,
    tenantData: ITenantUpdate
  ): Promise<ITenant | null> {
    try {
      const existingTenant = await this.findById(id);
      if (!existingTenant) {
        return null;
      }
      const updatedTenant = {
        ...existingTenant,
        ...tenantData,
        updated_at: new Date(),
      };
      await executeQuery(TenantModel.UPDATE_QUERY, [
        updatedTenant.name,
        updatedTenant.code,
        updatedTenant.subdomain,
        updatedTenant.timezone,
        updatedTenant.currency,
        updatedTenant.is_active,
        updatedTenant.id,
      ]);
      return this.findById(id);
    } catch (error) {
      console.error("❌ Error updating tenant:", error);
      throw error;
    }
  }

  /**
   * Delete a tenant by ID
   * @param id - Tenant ID
   * @returns True if deleted, false otherwise
   */
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await executeQuery(TenantModel.DELETE_QUERY, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("❌ Error deleting tenant:", error);
      throw error;
    }
  }
}
