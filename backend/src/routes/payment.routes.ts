import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../middleware/validate";
import {
  createPaymentSchema,
  paymentIdSchema,
  paymentsByMembershipSchema,
} from "../validation/paymentSchemas";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.post(
  "/",
  validate({ body: createPaymentSchema }),
  PaymentController.create
);
router.get("/", PaymentController.getAll);
router.get(
  "/:id",
  validate({ params: paymentIdSchema }),
  PaymentController.getById
);

// Get all payments for a specific membership
router.get(
  "/membership/:membership_id",
  validate({ params: paymentsByMembershipSchema }),
  PaymentController.getAllByMembership
);

// Only admins can delete payments
router.use(requireAdmin);

router.delete(
  "/:id",
  validate({ params: paymentIdSchema }),
  PaymentController.delete
);

export default router;
