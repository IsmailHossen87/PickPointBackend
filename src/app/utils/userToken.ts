// Access Token and Refresh Token

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, Iuser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHalper/App.Error";
import httpStatus from "http-status-codes"


// Access Token and Refresh Token created 
export const createUserToken = (user: Partial<Iuser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    // REFRESH token
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken, refreshToken,

    }
}
// And its function to do refreshToken uses Access Token

export const createNewAccessTokenWinthRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExites = await User.findOne({ email: verifiedRefreshToken.email })
    if (!isUserExites) {
        throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit")
    }
    if (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.isActive}`)
    }
    if (isUserExites.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExites._id,
        email: isUserExites.email,
        role: isUserExites.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}

// all funtionality auth.service.ts