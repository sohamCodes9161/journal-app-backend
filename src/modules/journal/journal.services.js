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
  const page = parseInt(query.page) || 1;

  const limit = parseInt(query.limit) || 10;

  const skip = (page - 1) * limit;

  const filters = {};

  if (query.mood) {
    filters.mood = query.mood;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  const sortBy = query.sortBy || "createdAt";

  const sortType = query.sortType === "asc" ? 1 : -1;

  const sortOptions = {
    [sortBy]: sortType,
  };

  const journals = await getUserJournals({
    userId,
    filters,
    sortOptions,
    skip,
    limit,
  });

  const totalJournals = await countUserJournals({
    userId,
    filters,
  });

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
