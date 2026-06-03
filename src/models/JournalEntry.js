import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    content: {
      iv: {
        type: String,
        required: true,
      },
      encryptedData: {
        type: String,
        required: true,
      },
    },

    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "neutral",
        "anxious",
        "excited",
        "angry",
        "grateful",
        "tired",
        "reflective",
      ],
      default: "neutral",
    },

    category: {
      type: String,
      default: "general",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    attachments: [
      {
        type: String,
      },
    ],

    isDraft: {
      type: Boolean,
      default: false,
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    /* 🎨 NEW FEATURE: Emotional Customization Settings */
    /* 🎨 CUSTOMIZATION ENGINE: Expanded Creative & Emotional Aesthetics */
    styleSettings: {
      themePreset: {
        type: String,
        enum: [
          // --- Core Themes ---
          "cosmic-dark",
          "warm-parchment",
          "vibrant-release",
          "minimal-matte",

          // --- Dark & Atmospheric Escapes ---
          "midnight-neon", // High contrast dark cyber vibes
          "obsidian-vault", // Deep monochromatic matte blacks
          "nebula-mist", // Cosmic purples and deep space blues
          "stardust-dream", // Soft twinkling dark slate

          // --- Florals, Botanicals & Earth Textures ---
          "floral-sanctuary", // Deep vintage roses and dark florals
          "botanic-shadows", // Dark forest greens and ivy overlays
          "wilted-orchid", // Moody, deep plum botanical textures
          "enchanted-woods", // Mossy bark and warm autumn tones
          "sakura-dusk", // Twilight cherry blossoms on deep slate

          // --- Warm, Nostalgic & Cozy Textures ---
          "vintage-library", // Smoked cedar and aged book spines
          "desert-sandstone", // Warm clay, terracotta, and soft stone
          "cozy-hearth", // Deep amber glows and charcoal smoke
          "amber-apothecary", // Warm tint glass and herbal accents

          // --- Soft Pastel & High-Vibrancy Releases ---
          "lavender-haze", // Dreamy pastel violet and misty mornings
          "ocean-serenity", // Calm coastal tiffany blues and seafoam
          "solar-flare", // High-energy energetic sunset gradients
          "aurora-borealis", // Shifting northern lights neon glows
        ],
        default: "cosmic-dark",
      },
      layoutWidth: {
        type: String,
        enum: [
          "max-w-3xl",
          "max-w-4xl",
          "max-w-5xl",
          "max-w-6xl",
          "max-w-7xl",
          "max-w-full",
        ],
        default: "max-w-5xl",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compounded Performance Indexes
journalEntrySchema.index({
  userId: 1,
  createdAt: -1,
});

journalEntrySchema.index({
  tags: 1,
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

export default JournalEntry;
