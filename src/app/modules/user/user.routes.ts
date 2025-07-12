
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controler";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import  { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHalper/App.Error";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const router = Router()

const checkAuth = (...authRoles :string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(404, "No Token Recieved")
        }

        // const verifyToken = jwt.verify(accessToken,"secret")
        const verifyedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)
        if (!verifyedToken) {
            throw new AppError(404, "Your are not authorized")
        }
        // user cann't use
        if ((verifyToken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN) {
            throw new AppError(403, "Your are not Permitted to view this route")
        }
        console.log(verifyToken)
        next()

    } catch (err) {
        next(err)
    }
}


// Zod validation
router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

// accessToken
router.get("/allUsers", checkAuth("ADMIN","SUPERADMIN"),UserControllers.AllUsers)


// উপরে router er name এর condition টা ঠীক রাখার জন্য
export const UserRoutes = router;