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

export {
  findUserByEmail,
  findUserByUsername,
  createUser,
};