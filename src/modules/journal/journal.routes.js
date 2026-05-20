import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import { createJournalSchema } from "./journal.validation.js";

import { createJournalController } from "./journal.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createJournalSchema),
  createJournalController
);

export default router;
