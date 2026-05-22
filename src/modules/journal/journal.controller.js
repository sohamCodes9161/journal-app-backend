import {
  createJournalService,
  getSingleJournalService,
  updateJournalService,
} from "./journal.services.js";
import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";
import { get } from "mongoose";

const createJournalController = asyncHandler(async (req, res) => {
  const journal = await createJournalService(req.validatedData, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, journal, "Journal created successfully"));
});

const getSingleJournalController = asyncHandler(async (req, res) => {
  // console.log(req.params.journalId, req.user._id);
  const journal = await getSingleJournalService(
    req.params.journalId,
    req.user._id
  );
  return res
    .status(200)
    .json(new ApiResponse(200, journal, "Journal retrieved successfully"));
});

const updateJournalController = asyncHandler(async (req, res) => {
  const updatedJournal = await updateJournalService(
    req.params.journalId,
    req.validatedData,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJournal, "Journal updated successfully"));
});

export {
  createJournalController,
  getSingleJournalController,
  updateJournalController,
};
