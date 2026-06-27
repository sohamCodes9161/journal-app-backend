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

    // 🎨 Journal Appearance Settings
    styleSettings: {
      themePreset: {
        type: String,
        enum: [
          "warm-parchment",
          "sakura-dusk",
          "sky-breeze",
          "mint_sage",
          "desert-sandstone",
          "lavender_haze",
          "ocean-serenity",
          "mist_gray",
          "midnight",
        ],
        default: "warm-parchment",
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

// Performance Indexes
journalEntrySchema.index({
  userId: 1,
  createdAt: -1,
});

journalEntrySchema.index({
  tags: 1,
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

export default JournalEntry;
