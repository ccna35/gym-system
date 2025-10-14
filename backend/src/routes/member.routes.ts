import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { validate } from "../middleware/validate";
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdSchema,
} from "../validation/memberSchemas";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validate({ body: createMemberSchema }),
  MemberController.create
);
router.get("/", MemberController.getAll);
router.get(
  "/:id",
  validate({ params: memberIdSchema }),
  MemberController.getById
);
router.put(
  "/:id",
  validate({ params: memberIdSchema, body: updateMemberSchema }),
  MemberController.update
);
router.delete(
  "/:id",
  validate({ params: memberIdSchema }),
  MemberController.delete
);

export default router;
