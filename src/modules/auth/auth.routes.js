import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
    loginSchema,
  registerSchema,
} from "../../validators/auth.validation.js";

import {
  registerUser,
    loginUser,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post("/login",validate(loginSchema), loginUser);

export default router;