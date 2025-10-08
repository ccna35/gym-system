import { Request, Response } from "express";
import { TenantApplicationService } from "../services/tenantApplicationService";
import {
  ITenantApplicationCreate,
  TenantApplicationStatus,
} from "../models/TenantApplication";

export class TenantApplicationController {
  /**
   * Create a new tenant application
   * POST /api/tenant-applications
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        gym_name,
        subdomain,
        owner_name,
        email,
        phone,
      }: ITenantApplicationCreate = req.body;

      const application = await TenantApplicationService.create({
        gym_name,
        subdomain: subdomain.toLowerCase(),
        owner_name,
        email: email.toLowerCase(),
        phone,
      });

      res.status(201).json({
        success: true,
        message: "Tenant application created successfully",
        data: application,
      });
    } catch (error: any) {
      console.error("Error creating tenant application:", error);

      if (error.message.includes("already exists")) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  }

  /**
   * Get all tenant applications
   * GET /api/tenant-applications
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query as { status?: string };
      const applications = status
        ? await TenantApplicationService.findByStatus(
            status as TenantApplicationStatus
          )
        : await TenantApplicationService.findAll();

      res.status(200).json({
        success: true,
        message: "Tenant applications retrieved successfully",
        data: applications,
        count: applications.length,
      });
    } catch (error) {
      console.error("Error fetching tenant applications:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get tenant application by ID
   * GET /api/tenant-applications/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await TenantApplicationService.findById(
        applicationId
      );

      if (!application) {
        res.status(404).json({
          success: false,
          message: "Tenant application not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Tenant application retrieved successfully",
        data: application,
      });
    } catch (error) {
      console.error("Error fetching tenant application:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Update tenant application status
   * PATCH /api/tenant-applications/:id/status
   */
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, review_notes } = req.body as {
        status: TenantApplicationStatus;
        review_notes?: string;
      };
      const updatedApplication = await TenantApplicationService.updateStatus(
        applicationId,
        status,
        review_notes
      );

      if (!updatedApplication) {
        res.status(404).json({
          success: false,
          message: "Tenant application not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        data: updatedApplication,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Verify email for tenant application
   * PATCH /api/tenant-applications/:id/verify-email
   */
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id);
      const updatedApplication = await TenantApplicationService.verifyEmail(
        applicationId
      );

      if (!updatedApplication) {
        res.status(404).json({
          success: false,
          message: "Tenant application not found or email already verified",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: updatedApplication,
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get applications statistics
   * GET /api/tenant-applications/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await TenantApplicationService.getCountsByStatus();

      res.status(200).json({
        success: true,
        message: "Application statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching application stats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Delete tenant application (admin only)
   * DELETE /api/tenant-applications/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id);
      const deleted = await TenantApplicationService.delete(applicationId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Tenant application not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Tenant application deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting tenant application:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
