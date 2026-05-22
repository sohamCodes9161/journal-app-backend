import { decrypt } from "../../utils/encryption.js";

const serializeJournal = (journal) => {
  return {
    id: journal._id,

    title: journal.title,

    content: JSON.parse(decrypt(journal.content)),
    mood: journal.mood,

    category: journal.category,

    tags: journal.tags,

    attachments: journal.attachments,

    isDraft: journal.isDraft,

    wordCount: journal.wordCount,

    createdAt: journal.createdAt,

    updatedAt: journal.updatedAt,
  };
};

const serializeJournals = (journals) => {
  return journals.map(serializeJournal);
};

export { serializeJournal, serializeJournals };
