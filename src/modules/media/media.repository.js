import Media from "./media.model.js";

const createMedia = async (data) => {
  return await Media.create(data);
};

const findMediaById = async (id) => {
  return await Media.findById(id);
};

const deleteMediaById = async (id) => {
  return await Media.findByIdAndDelete(id);
};

const findUserMedia = async (userId) => {
  return await Media.find({ userId }).sort({ createdAt: -1 });
};

export { createMedia, findMediaById, deleteMediaById, findUserMedia };
