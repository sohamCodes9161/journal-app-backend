import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
  registerSchema,
} from "../../validators/auth.validation.js";

import {
  registerUser,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

export default router;