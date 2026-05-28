import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import { uploadImageService } from "./upload.service.js";

const uploadImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image file is required"));
  }

  const result = await uploadImageService(req.file.buffer);

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        imageUrl: result.secure_url,

        publicId: result.public_id,
      },

      "Image uploaded successfully"
    )
  );
});

export { uploadImageController };
