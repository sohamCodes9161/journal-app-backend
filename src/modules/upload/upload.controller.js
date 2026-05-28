import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import { uploadImageService, deleteImageService } from "./upload.service.js";

const uploadImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image file is required"));
  }

  const result = await uploadImageService(req.file.buffer, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: {
      mediaId: result.mediaId,
      url: result.url,
      publicId: result.publicId,
    },
  });
});

const deleteImageController = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  await deleteImageService(mediaId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Image deleted successfully"));
});
export { uploadImageController, deleteImageController };
