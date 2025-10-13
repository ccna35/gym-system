import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { validate } from "../middleware/validate";
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdSchema,
} from "../validation/memberSchemas";

const router = Router();

router.post(
  "/",
  validate({ body: createMemberSchema }),
  MemberController.create
);
router.get("/", validate({ query: memberIdSchema }), MemberController.getAll);
router.get(
  "/:id/:tenant_id",
  validate({ params: memberIdSchema }),
  MemberController.getById
);
router.put(
  "/:id/:tenant_id",
  validate({ params: memberIdSchema, body: updateMemberSchema }),
  MemberController.update
);
router.delete(
  "/:id/:tenant_id",
  validate({ params: memberIdSchema }),
  MemberController.delete
);

export default router;
