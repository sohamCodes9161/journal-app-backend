import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 255 },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    horizonType: {
      type: String,
      enum: ["today", "week", "later"],
      default: "today",
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// CRITICAL CLEANUP: Indexing for high-speed lookups
todoSchema.index({ userId: 1, horizonType: 1 });
todoSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Todo", todoSchema);
