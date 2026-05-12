import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    themePreference: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    journalingGoal: {
      type: String,
      default: "",
    },

    productivityGoal: {
      type: String,
      default: "",
    },

    reminderSettings: {
      journalingReminder: {
        type: Boolean,
        default: false,
      },

      todoReminder: {
        type: Boolean,
        default: false,
      },

      reminderTime: {
        type: String,
        default: "20:00",
      },
    },

    streaks: {
      journalingStreak: {
        type: Number,
        default: 0,
      },

      productivityStreak: {
        type: Number,
        default: 0,
      },
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",userSchema);

export default User;    