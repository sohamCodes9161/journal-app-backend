import User from "../../models/User.js";

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByIdWithoutSensitiveFields = async (userId) => {
  return await User.findById(userId).select("-password -refreshToken -__v");
};

const updateUserRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken,
      },
    },
    {
      new: true,
    }
  );
};

const findUserByIdAndUpdate = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
    }
  );
};

export {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserById,
  findUserByIdWithoutSensitiveFields,
  updateUserRefreshToken,
  findUserByIdAndUpdate,
};
