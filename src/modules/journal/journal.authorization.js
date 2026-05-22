import ApiError from "../../utils/ApiError.js";

import { findJournalById } from "./journal.repository.js";

const getOwnedJournalOrThrow = async (journalId, userId) => {
  const journal = await findJournalById(journalId);

  if (!journal) {
    throw new ApiError(404, "Journal not found");
  }

  if (journal.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized access to journal");
  }

  return journal;
};

export { getOwnedJournalOrThrow };
