import { NextFunction, Request, Response } from "express";
import AppError from "../errorHalper/App.Error";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(404, "No Token Recieved")
        }

        // const verifyToken = jwt.verify(accessToken,"secret")
        const verifyedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload



        const isUserExites = await User.findOne({ email: verifyedToken.email })

        
        if (!isUserExites) {
            throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit")
        }
        if (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.isActive}`)
        }
        if (isUserExites.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }
        if (!isUserExites.isVerified) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
        }


        if (!authRoles.includes(verifyedToken.role)) {
            throw new AppError(403, "Your are not Permitted to view this route")
        }
        // global authentication er jonno
        req.user = verifyedToken
        next()

    } catch (err) {
        next(err)
    }
}
