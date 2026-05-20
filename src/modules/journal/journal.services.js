import { createJournal } from "./journal.repository.js";

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

export { createJournalService };
