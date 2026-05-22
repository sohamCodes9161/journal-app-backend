import JournalEntry from "../../models/JournalEntry.js";

const createJournal = async (journalData) => {
  return await JournalEntry.create(journalData);
};

const findJournalById = async (journalId) => {
  return await JournalEntry.findById(journalId);
};

const updateJournalById = async (journalId, updatedData) => {
  return await JournalEntry.findByIdAndUpdate(journalId, updatedData, {
    new: true,
  });
};

const deleteJournalById = async (journalId) => {
  return await JournalEntry.findByIdAndDelete(journalId);
};

const getUserJournals = async ({
  userId,
  filters,
  sortOptions,
  skip,
  limit,
}) => {
  return await JournalEntry.find({
    userId,
    ...filters,
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

const countUserJournals = async ({ userId, filters }) => {
  return await JournalEntry.countDocuments({
    userId,
    ...filters,
  });
};

export {
  createJournal,
  findJournalById,
  updateJournalById,
  deleteJournalById,
  getUserJournals,
  countUserJournals,
};
