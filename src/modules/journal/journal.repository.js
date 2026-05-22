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

export { createJournal, findJournalById, updateJournalById };
