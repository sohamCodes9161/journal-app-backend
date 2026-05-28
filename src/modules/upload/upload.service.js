import cloudinary from "../../config/cloudinary.js";
import {
  createMedia,
  deleteMediaById,
  findMediaById,
} from "../media/media.repository.js";

const uploadImageService = async (fileBuffer, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "journal-app",
      },

      async (error, result) => {
        if (error) return reject(error);

        // save in DB AFTER upload success
        const media = await createMedia({
          userId,
          url: result.secure_url,
          publicId: result.public_id,
          type: "image",
          format: result.format,
          size: result.bytes,
        });

        resolve({
          mediaId: media._id,
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

const deleteImageService = async (mediaId, userId) => {
  const media = await findMediaById(mediaId);

  if (!media) {
    throw new Error("Media not found");
  }

  // ownership check
  if (media.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  // delete from cloudinary
  await cloudinary.uploader.destroy(media.publicId);

  // delete from DB
  await deleteMediaById(mediaId);

  return true;
};

export { uploadImageService, deleteImageService };
