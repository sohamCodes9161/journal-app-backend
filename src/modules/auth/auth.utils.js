import ApiError from "../../utils/ApiError.js";

import User from "../../models/User.js";

const generateAccessAndRefreshTokens =
  async (userId) => {

    try {

      const user =
        await User.findById(userId);

      const accessToken =
        user.generateAccessToken();

      const refreshToken =
        user.generateRefreshToken();

      user.refreshToken = refreshToken;

      await user.save({
        validateBeforeSave: false,
      });

      return {
        accessToken,
        refreshToken,
      };

    } catch (error) {

      throw new ApiError(
        500,
        "Failed to generate tokens"
      );
    }
};

export {
  generateAccessAndRefreshTokens,
};