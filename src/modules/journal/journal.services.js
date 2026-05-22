import {
  createJournal,
  findJournalById,
  updateJournalById,
} from "./journal.repository.js";
import ApiError from "../../utils/ApiError.js";
import { calculateWordCount } from "./journal.utils.js";

const createJournalService = async (journalData, userId) => {
  const { title, content, mood, category, tags, isDraft } = journalData;

  const wordCount = calculateWordCount(content);

  const journal = await createJournal({
    userId,
    title,
    content,
    mood,
    category,
    tags,
    isDraft,
    wordCount,
  });

  return journal;
};

const getSingleJournalService = async (journalId, userId) => {
  const journal = await findJournalById(journalId);

  if (!journal) {
    throw new ApiError(404, "Journal entry not found");
  }
  if (journal.userId.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to access this journal entry"
    );
  }
  return journal;
};

const updateJournalService = async (journalId, updateData, userId) => {
  const existingJournal = await findJournalById(journalId);

  if (!existingJournal) {
    throw new ApiError(404, "Journal not found");
  }

  if (existingJournal.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized access to journal");
  }

  const updatedFields = {
    ...updateData,
  };

  if (updateData.content) {
    updatedFields.wordCount = calculateWordCount(updateData.content);
  }

  const updatedJournal = await updateJournalById(journalId, updatedFields);

  return updatedJournal;
};
export { createJournalService, getSingleJournalService, updateJournalService };
