import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// GET /api/v1/dashboard/summary
router.get("/summary", DashboardController.summary);

export default router;
