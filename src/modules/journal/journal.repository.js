import JournalEntry from "../../models/JournalEntry.js";

const createJournal = async (journalData) => {
  return await JournalEntry.create(journalData);
};

const findJournalById = async (journalId) => {
  return await JournalEntry.findById(journalId);
};

export { createJournal, findJournalById };
