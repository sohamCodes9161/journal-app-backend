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

const updateJournalSchema = z
  .object({
    title: z.string().max(150).optional(),

    content: z.any().optional(),

    mood: z
      .enum(["happy", "sad", "neutral", "anxious", "excited", "angry"])
      .optional(),

    category: z.string().optional(),

    tags: z.array(z.string()).optional(),

    isDraft: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export { createJournalSchema, updateJournalSchema };
