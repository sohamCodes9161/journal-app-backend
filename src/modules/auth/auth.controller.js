import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import { registerUserService, loginUserService } from "./auth.service.js";

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

const loginUser = asyncHandler(
    async (req, res) => {

        const result =
            await loginUserService(
                req.validatedData
            );

        const options = {
            httpOnly: true,
            secure: false,
        };

        return res
            .status(200)
            .cookie(
                "accessToken",
                result.accessToken,
                options
            )
            .cookie(
                "refreshToken",
                result.refreshToken,
                options
            )
            .json(
                new ApiResponse(
                    200,
                    {
                        user: result.user,
                        accessToken:
                            result.accessToken,
                    },
                    "User logged in successfully"
                )
            );
    }
);

const getCurrentUser = asyncHandler(
    async (req, res) => {

        return res.status(200).json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
    }
);
export { registerUser, loginUser, getCurrentUser };