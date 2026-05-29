import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import upload from "../../middleware/multer.middleware.js";

import {
  uploadMediaController,
  deleteMediaController,
} from "./media.controller.js";

const router = Router();

router.post("/upload", verifyJWT, upload.single("file"), uploadMediaController);

router.delete(
  "/:mediaId",

  verifyJWT,

  deleteMediaController
);

export const mediaRoutes = router;
