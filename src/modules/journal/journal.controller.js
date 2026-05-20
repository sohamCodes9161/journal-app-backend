import { createJournalService } from "./journal.services.js";
import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

const createJournalController = asyncHandler(async (req, res) => {
  const journal = await createJournalService(req.validatedData, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, journal, "Journal created successfully"));
});

export { createJournalController };
