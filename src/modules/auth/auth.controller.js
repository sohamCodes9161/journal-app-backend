import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import { registerUserService } from "./auth.service.js";

const registerUser = asyncHandler(async (req, res) => {

  const user = await registerUserService(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      user,
      "User registered successfully"
    )
  );
});

export { registerUser };