import { z } from "zod";

const allowedThemes = [
  "warm-parchment",
  "sakura-dusk",
  "sky-breeze",
  "mint_sage",
  "desert-sandstone",
  "lavender_haze",
  "ocean-serenity",
  "mist_gray",
  "midnight",
];

const styleSettingsSchema = z.object({
  themePreset: z.enum(allowedThemes).default("warm-parchment"),

  layoutWidth: z
    .enum([
      "max-w-3xl",
      "max-w-4xl",
      "max-w-5xl",
      "max-w-6xl",
      "max-w-7xl",
      "max-w-full",
    ])
    .default("max-w-5xl"),
});

const createJournalSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.any(),
  mood: z
    .enum([
      "happy",
      "sad",
      "neutral",
      "anxious",
      "excited",
      "angry",
      "grateful",
      "tired",
      "reflective",
    ])
    .optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isDraft: z.boolean().optional(),
  styleSettings: styleSettingsSchema.optional(),
});

const updateJournalValidatorSchema = z.object({
  title: z.string().max(150).optional(),
  content: z.any().optional(),
  mood: z
    .enum([
      "happy",
      "sad",
      "neutral",
      "anxious",
      "excited",
      "angry",
      "grateful",
      "tired",
      "reflective",
    ])
    .optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  styleSettings: styleSettingsSchema.optional(),
});

export { createJournalSchema, updateJournalValidatorSchema };
