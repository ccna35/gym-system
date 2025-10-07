import { Router } from "express";
import { TenantApplicationController } from "../controllers/tenantApplicationController";

const router = Router();

// Create new tenant application
router.post("/", TenantApplicationController.create);

// Get all tenant applications (with optional status filter)
router.get("/", TenantApplicationController.getAll);

// Get application statistics
router.get("/stats", TenantApplicationController.getStats);

// Get tenant application by ID
router.get("/:id", TenantApplicationController.getById);

// Update application status
router.patch("/:id/status", TenantApplicationController.updateStatus);

// Verify email
router.patch("/:id/verify-email", TenantApplicationController.verifyEmail);

// Delete tenant application (admin only)
router.delete("/:id", TenantApplicationController.delete);

export default router;
