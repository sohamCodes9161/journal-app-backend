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

export { createJournal, findJournalById, updateJournalById, deleteJournalById };
