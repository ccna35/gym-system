import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";
import { validate } from "../middleware/validate";
import {
  createPlanSchema,
  updatePlanSchema,
  planIdSchema,
} from "../validation/planSchemas";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get("/", PlanController.getAll);
router.get("/:id", validate({ params: planIdSchema }), PlanController.getById);

// Only admins can create, update, delete plans
router.use(requireAdmin);

router.post("/", validate({ body: createPlanSchema }), PlanController.create);

router.put(
  "/:id",
  validate({ params: planIdSchema, body: updatePlanSchema }),
  PlanController.update
);
router.delete(
  "/:id",
  validate({ params: planIdSchema }),
  PlanController.delete
);

export default router;
