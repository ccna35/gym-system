import { Router } from "express";
import { TenantApplicationController } from "../controllers/tenantApplication.controller";
import { validate } from "../middleware/validate";
import {
  tenantApplicationCreateSchema,
  tenantApplicationQuerySchema,
  idParamSchema,
  tenantApplicationStatusUpdateSchema,
} from "../validation/tenantApplicationSchemas";

const router = Router();

// Create new tenant application
router.post(
  "/",
  validate({ body: tenantApplicationCreateSchema }),
  TenantApplicationController.create
);

// Get all tenant applications (with optional status filter)
router.get(
  "/",
  validate({ query: tenantApplicationQuerySchema }),
  TenantApplicationController.getAll
);

// Get application statistics
router.get("/stats", TenantApplicationController.getStats);

// Get tenant application by ID
router.get(
  "/:id",
  validate({ params: idParamSchema }),
  TenantApplicationController.getById
);

// Update application status
router.patch(
  "/:id/status",
  validate({
    params: idParamSchema,
    body: tenantApplicationStatusUpdateSchema,
  }),
  TenantApplicationController.updateStatus
);

// Verify email
router.patch(
  "/:id/verify-email",
  validate({ params: idParamSchema }),
  TenantApplicationController.verifyEmail
);

// Delete tenant application (admin only)
router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  TenantApplicationController.delete
);

export default router;
