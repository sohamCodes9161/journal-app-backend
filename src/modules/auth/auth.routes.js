import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";
import verifyJWT from "../../middlewares/auth.middleware.js";
import {
  loginSchema,
  registerSchema,
} from "../../validators/auth.validation.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post("/login", validate(loginSchema), loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);


export default router;