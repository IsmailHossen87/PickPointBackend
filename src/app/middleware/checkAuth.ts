import { NextFunction, Request, Response } from "express";
import AppError from "../errorHalper/App.Error";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles :string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(404, "No Token Recieved")
        }

        // const verifyToken = jwt.verify(accessToken,"secret")
        const verifyedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        if (!verifyedToken) {
            throw new AppError(404, "Your are not authorized")
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
