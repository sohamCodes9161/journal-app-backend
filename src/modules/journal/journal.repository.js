import JournalEntry from "../../models/JournalEntry.js";

const createJournal = async (journalData) => {
  return await JournalEntry.create(journalData);
};

export { createJournal };
