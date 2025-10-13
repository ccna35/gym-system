import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validation/authSchemas";

const router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  AuthController.register
);
router.post("/login", validate({ body: loginSchema }), AuthController.login);

export default router;
