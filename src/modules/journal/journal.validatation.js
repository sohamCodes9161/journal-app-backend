import { z } from "zod";

const createJournalSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),

  content: z.any(),

  mood: z
    .enum(["happy", "sad", "neutral", "anxious", "excited", "angry"])
    .optional(),

  category: z.string().optional(),

  tags: z.array(z.string()).optional(),

  isDraft: z.boolean().optional(),
});

export { createJournalSchema };
