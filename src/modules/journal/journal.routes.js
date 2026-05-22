import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import {
  createJournalSchema,
  updateJournalSchema,
} from "./journal.validation.js";

import {
  createJournalController,
  getSingleJournalController,
  updateJournalController,
} from "./journal.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createJournalSchema),
  createJournalController
);

router.get("/:journalId", verifyJWT, getSingleJournalController);
router.patch(
  "/:journalId",
  verifyJWT,
  validate(updateJournalSchema),
  updateJournalController
);
export default router;
