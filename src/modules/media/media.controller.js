import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import { uploadMediaService, deleteMediaService } from "./media.service.js";

const uploadMediaController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image file is required"));
  }

  const result = await uploadMediaService(req.file.buffer, req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        mediaId: result.mediaId,
        url: result.url,
        publicId: result.publicId,
      },
      "Image uploaded successfully"
    )
  );
});

const deleteMediaController = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  await deleteMediaService(mediaId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Image deleted successfully"));
});
export { uploadMediaController, deleteMediaController };
