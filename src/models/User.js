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
      enum: ["midnight-ink", "sage-garden", "sky-breeze", "sakura-mist"],
      default: "sky-breeze",
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
