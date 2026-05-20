import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import ApiError from "../../utils/ApiError.js";

import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
} from "./auth.service.js";

const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.validatedData);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, options)
    .cookie("refreshToken", result.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService(req.user._id);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }
  const result = await refreshAccessTokenService(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, options)
    .cookie("refreshToken", result.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken: result.accessToken,
        },
        "Access token refreshed successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
};
