import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import upload from "../../middleware/multer.middleware.js";

import { uploadImageController } from "./upload.controller.js";

const router = Router();

router.post(
  "/image",

  verifyJWT,

  upload.single("image"),

  uploadImageController
);

export default router;
