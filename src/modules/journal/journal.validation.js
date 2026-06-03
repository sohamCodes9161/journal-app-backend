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

  // ⬇️ UPDATE THIS OBJECT WITH THE EXPANDED THEMES
  styleSettings: z
    .object({
      themePreset: z
        .enum([
          "cosmic-dark",
          "warm-parchment",
          "vibrant-release",
          "minimal-matte",
          "midnight-neon",
          "obsidian-vault",
          "nebula-mist",
          "stardust-dream",
          "floral-sanctuary",
          "botanic-shadows",
          "wilted-orchid",
          "enchanted-woods",
          "sakura-dusk",
          "vintage-library",
          "desert-sandstone",
          "cozy-hearth",
          "amber-apothecary",
          "lavender-haze",
          "ocean-serenity",
          "solar-flare",
          "aurora-borealis",
        ])
        .optional(),
      layoutWidth: z
        .enum([
          "max-w-3xl",
          "max-w-4xl",
          "max-w-5xl",
          "max-w-6xl",
          "max-w-7xl",
          "max-w-full",
        ])
        .optional(),
    })
    .optional(),
});

export { createJournalSchema, updateJournalValidatorSchema };
