import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import {
  createJournalSchema,
  updateJournalValidatorSchema,
} from "./journal.validation.js";

import {
  createJournalController,
  getSingleJournalController,
  updateJournalController,
  deleteJournalController,
  getJournalsController,
} from "./journal.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createJournalSchema),
  createJournalController
);

router.get("/", verifyJWT, getJournalsController);
router.get("/:journalId", verifyJWT, getSingleJournalController);
router.patch(
  "/:journalId",
  verifyJWT,
  validate(updateJournalValidatorSchema),
  updateJournalController
);
router.delete("/:journalId", verifyJWT, deleteJournalController);
export default router;
