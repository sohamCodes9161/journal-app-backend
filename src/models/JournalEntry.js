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
          "azure_mist",
          "parchment",
          "almond_cream",
          "almond_silk",
          "camel",
          "celadon",
          "beige_custom",
          "soft_apricot",
          "cotton_candy",
          "taupe_grey",
          "pearl_beige",
          "ash_grey",
          "pacific_blue",
          "vintage_lavender",
          "midnight_violet",
        ],
        default: "parchment", // A nice soft default
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
