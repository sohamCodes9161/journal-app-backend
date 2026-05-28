import {
  createJournal,
  findJournalById,
  updateJournalById,
  deleteJournalById,
  getUserJournals,
  countUserJournals,
} from "./journal.repository.js";
import ApiError from "../../utils/ApiError.js";
import { calculateWordCount } from "./journal.utils.js";
import { encrypt, decrypt } from "../../utils/encryption.js";

import { getOwnedJournalOrThrow } from "./journal.authorization.js";

const createJournalService = async (journalData, userId) => {
  const { title, content, mood, category, tags, isDraft } = journalData;
  const stringifiedContent = JSON.stringify(content);
  const encryptedContent = encrypt(stringifiedContent);
  const wordCount = calculateWordCount(content);

  const journal = await createJournal({
    userId,
    title,
    content: encryptedContent,
    mood,
    category,
    tags,
    isDraft,
    wordCount,
  });

  return journal;
};

const getSingleJournalService = async (journalId, userId) => {
  return await getOwnedJournalOrThrow(journalId, userId);
};
const updateJournalService = async (journalId, updateData, userId) => {
  const journal = await getOwnedJournalOrThrow(journalId, userId);

  const updatedFields = {
    ...updateData,
  };
  if (updateData.content) {
    updatedFields.wordCount = calculateWordCount(updateData.content);

    const stringifiedContent = JSON.stringify(updateData.content);

    updatedFields.content = encrypt(stringifiedContent);
  }

  const updatedJournal = await updateJournalById(journalId, updatedFields);

  return updatedJournal;
};

const deleteJournalService = async (journalId, userId) => {
  const journal = await getOwnedJournalOrThrow(journalId, userId);
  await deleteJournalById(journalId);
};

const getJournalsService = async (query, userId) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const filters = {};

  // Mood filter
  if (query.mood) {
    filters.mood = query.mood;
  }

  // Category filter
  if (query.category) {
    filters.category = query.category;
  }

  // Title search
  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  // ✅ Date range filter (THIS WAS MISSING)
  if (query.startDate || query.endDate) {
    filters.createdAt = {};

    if (query.startDate) {
      const start = new Date(query.startDate);
      if (!isNaN(start)) {
        filters.createdAt.$gte = start;
      }
    }

    if (query.endDate) {
      const end = new Date(query.endDate);
      if (!isNaN(end)) {
        filters.createdAt.$lte = end;
      }
    }
  }

  const sortBy = query.sortBy || "createdAt";
  const sortType = query.sortType === "asc" ? 1 : -1;

  const sortOptions = {
    [sortBy]: sortType,
  };

  const [journals, totalJournals] = await Promise.all([
    getUserJournals({
      userId,
      filters,
      sortOptions,
      skip,
      limit,
    }),

    countUserJournals({
      userId,
      filters,
    }),
  ]);

  return {
    journals,
    pagination: {
      total: totalJournals,
      page,
      limit,
      totalPages: Math.ceil(totalJournals / limit),
    },
  };
};

export {
  createJournalService,
  getSingleJournalService,
  updateJournalService,
  deleteJournalService,
  getJournalsService,
};
