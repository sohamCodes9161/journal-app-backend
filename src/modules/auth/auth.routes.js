import { Router } from "express";
import upload from "../../middleware/multer.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import verifyJWT from "../../middleware/auth.middleware.js";
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
  updateUserSetting,
} from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);
router.patch(
  "/settings",
  verifyJWT,
  upload.single("avatar"),
  updateUserSetting
);
export default router;
