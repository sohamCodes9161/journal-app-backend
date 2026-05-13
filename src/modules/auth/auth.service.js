import ApiError from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";

import User from "../../models/User.js";

import { env } from "../../config/env.js";

import {
    createUser,
    findUserByEmail,
    findUserByUsername,
} from "./auth.repository.js";

import { generateAccessAndRefreshTokens } from "./auth.utils.js";

const registerUserService = async (userData) => {

    const {
        username,
        email,
        password,
    } = userData;


    const existingEmail =
        await findUserByEmail(email);

    if (existingEmail) {
        throw new ApiError(
            409,
            "Email already exists"
        );
    }

    const existingUsername =
        await findUserByUsername(username);

    if (existingUsername) {
        throw new ApiError(
            409,
            "Username already exists"
        );
    }

    const user = await createUser({
        username,
        email,
        password,
    });

    const createdUser =
        user.toObject();

    delete createdUser.password;
    delete createdUser.refreshToken;

    return createdUser;
};
const loginUserService = async (
    userData
) => {

    const {
        email,
        password,
    } = userData;

    const user =
        await findUserByEmail(email);

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const {
        accessToken,
        refreshToken,
    } =
        await generateAccessAndRefreshTokens(
            user._id
        );

    const loggedInUser =
        user.toObject();

    delete loggedInUser.password;
    delete loggedInUser.refreshToken;
    delete loggedInUser.__v;

    return {
        user: loggedInUser,
        accessToken,
        refreshToken,
    };
};


const refreshAccessTokenService = async (incomingRefreshToken) => {

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Refresh token missing"
        );
    }

    try {

        const decodedToken =
            jwt.verify(
                incomingRefreshToken,
                env.JWT_REFRESH_SECRET
            );

        const user =
            await User.findById(
                decodedToken?._id
            );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (
            incomingRefreshToken !==
            user.refreshToken
        ) {
            throw new ApiError(
                401,
                "Refresh token expired or reused"
            );
        }

        const {
            accessToken,
            refreshToken,
        } =
            await generateAccessAndRefreshTokens(
                user._id
            );

        return {
            accessToken,
            refreshToken,
        };

    } catch (error) {

        throw new ApiError(
            401,
            error?.message ||
            "Invalid refresh token"
        );
    }
};

const logoutUserService =
    async (userId) => {

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    refreshToken: "",
                },
            },
            {
                new: true,
            }
        );
    };

export {
    registerUserService,
    loginUserService,
    refreshAccessTokenService,
    logoutUserService
};