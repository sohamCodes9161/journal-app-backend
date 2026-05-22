import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import { createJournalSchema } from "./journal.validation.js";

import {
  createJournalController,
  getSingleJournalController,
} from "./journal.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createJournalSchema),
  createJournalController
);

router.get("/:journalId", verifyJWT, getSingleJournalController);

export default router;
