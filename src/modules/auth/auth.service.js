import ApiError from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  findUserByIdWithoutSensitiveFields,
  updateUserRefreshToken,
  findUserByIdAndUpdate,
} from "./auth.repository.js";

import { generateAccessAndRefreshTokens } from "./auth.utils.js";

const registerUserService = async (userData) => {
  const { username, email, password } = userData;

  const existingEmail = await findUserByEmail(email);

  if (existingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  const existingUsername = await findUserByUsername(username);

  if (existingUsername) {
    throw new ApiError(409, "Username already exists");
  }

  const user = await createUser({
    username,
    email,
    password,
  });

  const createdUser = user.toObject();

  delete createdUser.password;
  delete createdUser.refreshToken;

  return createdUser;
};
const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = user.toObject();

  delete loggedInUser.password;
  delete loggedInUser.refreshToken;
  delete loggedInUser.__v;

  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      env.JWT_REFRESH_SECRET
    );

    const user = await findUserById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or reused");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

const logoutUserService = async (userId) => {
  await updateUserRefreshToken(userId, "");
};

const updateUserSettingsService = async (userId, updatePayload) => {
  // 1. Define strict list of fields a user is legally permitted to touch
  const allowedUpdates = [
    "username",
    "profilePicture",
    "bio",
    "themePreference",
    "timezone",
    "journalingGoal",
    "productivityGoal",
    "reminderSettings",
  ];

  const filteredUpdates = {};

  // 2. Filter out anything malicious or unauthorized (like streaks or email)
  Object.keys(updatePayload).forEach((key) => {
    if (allowedUpdates.includes(key) && updatePayload[key] !== undefined) {
      // Handle nested structures safely like reminderSettings
      if (key === "reminderSettings") {
        filteredUpdates.reminderSettings = {
          ...filteredUpdates.reminderSettings,
          ...updatePayload.reminderSettings,
        };
      } else {
        filteredUpdates[key] = updatePayload[key];
      }
    }
  });

  // 3. Special handling for unique username changes to avoid database duplicate collisions
  if (filteredUpdates.username) {
    const existingUser = await findUserByUsername(filteredUpdates.username);

    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError(409, "Username already taken by another user");
    }
  }

  // 4. Commit changes to MongoDB safely using your repository function
  // REMOVED: .select() chain from the end of this call to fix the TypeError crash
  const updatedUser = await findUserByIdAndUpdate(userId, filteredUpdates);

  if (!updatedUser) {
    throw new ApiError(404, "User account not found.");
  }

  // 5. Convert to a plain JavaScript object and sanitize fields manually
  const userObject = updatedUser.toObject
    ? updatedUser.toObject()
    : updatedUser;

  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.__v;

  return userObject;
};

export {
  registerUserService,
  loginUserService,
  refreshAccessTokenService,
  logoutUserService,
  updateUserSettingsService,
};
