import jwt from "jsonwebtoken";

import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";

import ApiError from "../utils/ApiError.js";

import { env } from "../config/env.js";

const verifyJWT = asyncHandler(
    async (req, res, next) => {

        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")
                ?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        const decodedToken =
            jwt.verify(
                token,
                env.JWT_ACCESS_SECRET
            );

        const user =
            await User.findById(
                decodedToken?._id
            ).select(
                "-password -refreshToken -__v"
            );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        req.user = user;

        next();
    }
);

export default verifyJWT;