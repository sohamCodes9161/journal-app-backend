import ApiError from "../../utils/ApiError.js";

import {
    createUser,
    findUserByEmail,
    findUserByUsername,
} from "./auth.repository.js";

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

export {
    registerUserService,
};