import { Router } from "express";
import { MembershipController } from "../controllers/membership.controller";
import { validate } from "../middleware/validate";
import {
  createMembershipSchema,
  updateMembershipSchema,
  membershipIdSchema,
} from "../validation/membershipSchemas";
import { requireAdmin, requireAuth } from "../middleware/auth";
import Joi from "joi";
import { memberIdSchema } from "../validation/memberSchemas";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.post(
  "/",
  validate({ body: createMembershipSchema }),
  MembershipController.create
);
router.get("/", MembershipController.getAll);
router.get(
  "/:id",
  validate({ params: membershipIdSchema }),
  MembershipController.getById
);
router.get(
  "/member/:id",
  validate({
    params: memberIdSchema,
  }),
  MembershipController.getAllByMember
);
router.put(
  "/:id",
  validate({ params: membershipIdSchema, body: updateMembershipSchema }),
  MembershipController.update
);

// Require admin role for deleting memberships
router.use(requireAdmin);

router.delete(
  "/:id",
  validate({ params: membershipIdSchema }),
  MembershipController.delete
);

export default router;
