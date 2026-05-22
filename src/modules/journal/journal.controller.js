import {
  createJournalService,
  getSingleJournalService,
  updateJournalService,
  deleteJournalService,
} from "./journal.services.js";
import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";
import { get } from "mongoose";

import { serializeJournal, serializeJournals } from "./journal.serializer.js";

const createJournalController = asyncHandler(async (req, res) => {
  const journal = await createJournalService(req.validatedData, req.user._id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        serializeJournal(journal),
        "Journal created successfully"
      )
    );
});

const getSingleJournalController = asyncHandler(async (req, res) => {
  // console.log(req.params.journalId, req.user._id);
  const journal = await getSingleJournalService(
    req.params.journalId,
    req.user._id
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeJournal(journal),
        "Journal retrieved successfully"
      )
    );
});

const updateJournalController = asyncHandler(async (req, res) => {
  const updatedJournal = await updateJournalService(
    req.params.journalId,
    req.validatedData,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeJournal(updatedJournal),
        "Journal updated successfully"
      )
    );
});

const deleteJournalController = asyncHandler(async (req, res) => {
  await deleteJournalService(req.params.journalId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Journal deleted successfully"));
});

export {
  createJournalController,
  getSingleJournalController,
  updateJournalController,
  deleteJournalController,
};
