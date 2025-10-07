import { executeQuery } from "../db/connection";
import {
  ITenantApplication,
  ITenantApplicationCreate,
  ITenantApplicationUpdate,
  TenantApplicationStatus,
  TenantApplicationModel,
} from "../models/TenantApplication";

export class TenantApplicationService {
  /**
   * Create a new tenant application
   */
  static async create(
    applicationData: ITenantApplicationCreate
  ): Promise<ITenantApplication> {
    try {
      const { gym_name, subdomain, owner_name, email, phone } = applicationData;

      // Check if email or subdomain already exists
      const existingEmail = await this.findByEmail(email);
      if (existingEmail) {
        throw new Error("Email already exists in applications");
      }

      const existingSubdomain = await this.findBySubdomain(subdomain);
      if (existingSubdomain) {
        throw new Error("Subdomain already exists in applications");
      }

      const result = await executeQuery(TenantApplicationModel.INSERT_QUERY, [
        gym_name,
        subdomain,
        owner_name,
        email,
        phone || null,
        "PENDING_EMAIL",
      ]);

      const created = await this.findById(result.insertId);
      if (!created) {
        throw new Error("Failed to retrieve created tenant application");
      }

      return created;
    } catch (error) {
      console.error("❌ Error creating tenant application:", error);
      throw error;
    }
  }

  /**
   * Find all tenant applications
   */
  static async findAll(): Promise<ITenantApplication[]> {
    try {
      const rows = await executeQuery(TenantApplicationModel.SELECT_ALL_QUERY);
      return rows as ITenantApplication[];
    } catch (error) {
      console.error("❌ Error fetching tenant applications:", error);
      throw error;
    }
  }

  /**
   * Find tenant application by ID
   */
  static async findById(id: number): Promise<ITenantApplication | null> {
    try {
      const rows = await executeQuery(
        TenantApplicationModel.SELECT_BY_ID_QUERY,
        [id]
      );
      return rows.length > 0 ? (rows[0] as ITenantApplication) : null;
    } catch (error) {
      console.error("❌ Error fetching tenant application by ID:", error);
      throw error;
    }
  }

  /**
   * Find tenant application by email
   */
  static async findByEmail(email: string): Promise<ITenantApplication | null> {
    try {
      const rows = await executeQuery(
        TenantApplicationModel.SELECT_BY_EMAIL_QUERY,
        [email]
      );
      return rows.length > 0 ? (rows[0] as ITenantApplication) : null;
    } catch (error) {
      console.error("❌ Error fetching tenant application by email:", error);
      throw error;
    }
  }

  /**
   * Find tenant application by subdomain
   */
  static async findBySubdomain(
    subdomain: string
  ): Promise<ITenantApplication | null> {
    try {
      const rows = await executeQuery(
        TenantApplicationModel.SELECT_BY_SUBDOMAIN_QUERY,
        [subdomain]
      );
      return rows.length > 0 ? (rows[0] as ITenantApplication) : null;
    } catch (error) {
      console.error(
        "❌ Error fetching tenant application by subdomain:",
        error
      );
      throw error;
    }
  }

  /**
   * Find tenant applications by status
   */
  static async findByStatus(
    status: TenantApplicationStatus
  ): Promise<ITenantApplication[]> {
    try {
      const rows = await executeQuery(
        TenantApplicationModel.SELECT_BY_STATUS_QUERY,
        [status]
      );
      return rows as ITenantApplication[];
    } catch (error) {
      console.error("❌ Error fetching tenant applications by status:", error);
      throw error;
    }
  }

  /**
   * Update tenant application
   */
  static async update(
    id: number,
    updateData: ITenantApplicationUpdate
  ): Promise<ITenantApplication | null> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error("Tenant application not found");
      }

      const updatedData = { ...existing, ...updateData };

      await executeQuery(TenantApplicationModel.UPDATE_QUERY, [
        updatedData.gym_name,
        updatedData.subdomain,
        updatedData.owner_name,
        updatedData.email,
        updatedData.phone,
        updatedData.status,
        updatedData.email_verified_at,
        updatedData.review_notes,
        id,
      ]);

      return await this.findById(id);
    } catch (error) {
      console.error("❌ Error updating tenant application:", error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateStatus(
    id: number,
    status: TenantApplicationStatus,
    reviewNotes?: string
  ): Promise<ITenantApplication | null> {
    try {
      await executeQuery(TenantApplicationModel.UPDATE_STATUS_QUERY, [
        status,
        reviewNotes || null,
        id,
      ]);

      return await this.findById(id);
    } catch (error) {
      console.error("❌ Error updating tenant application status:", error);
      throw error;
    }
  }

  /**
   * Mark email as verified
   */
  static async verifyEmail(id: number): Promise<ITenantApplication | null> {
    try {
      const now = new Date();
      await executeQuery(TenantApplicationModel.UPDATE_EMAIL_VERIFIED_QUERY, [
        now,
        id,
      ]);

      return await this.findById(id);
    } catch (error) {
      console.error("❌ Error verifying email:", error);
      throw error;
    }
  }

  /**
   * Delete tenant application
   */
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await executeQuery(TenantApplicationModel.DELETE_QUERY, [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("❌ Error deleting tenant application:", error);
      throw error;
    }
  }

  /**
   * Get applications count by status
   */
  static async getCountsByStatus(): Promise<
    { status: string; count: number }[]
  > {
    try {
      const rows = await executeQuery(
        TenantApplicationModel.COUNT_BY_STATUS_QUERY
      );
      return rows as { status: string; count: number }[];
    } catch (error) {
      console.error("❌ Error getting applications count:", error);
      throw error;
    }
  }
}
