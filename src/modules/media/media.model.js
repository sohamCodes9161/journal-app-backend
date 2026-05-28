import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    journalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalEntry",
      default: null,
      index: true,
    },

    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["image", "gif"],
      default: "image",
    },

    format: {
      type: String,
      default: "jpg",
    },

    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mediaSchema.index({ userId: 1, createdAt: -1 });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
