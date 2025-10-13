import { Router } from "express";
import { PlanController } from "../controllers/planController";
import { validate } from "../middleware/validate";
import {
  createPlanSchema,
  updatePlanSchema,
  planIdSchema,
} from "../validation/planSchemas";

const router = Router();

router.post("/", validate({ body: createPlanSchema }), PlanController.create);
router.get("/", validate({ query: planIdSchema }), PlanController.getAll);
router.get(
  "/:id/:tenant_id",
  validate({ params: planIdSchema }),
  PlanController.getById
);
router.put(
  "/:id/:tenant_id",
  validate({ params: planIdSchema, body: updatePlanSchema }),
  PlanController.update
);
router.delete(
  "/:id/:tenant_id",
  validate({ params: planIdSchema }),
  PlanController.delete
);

export default router;
