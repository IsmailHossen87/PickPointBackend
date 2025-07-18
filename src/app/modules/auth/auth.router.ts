import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()
router.post("/login",AuthControler.credentialLogin)
router.post("/logout",AuthControler.logout)
router.post("/refresh-token",AuthControler.getNewAccessToken)
router.post("/reset-password",checkAuth(...Object.values(Role)) ,AuthControler.resetPassword)
// google diye authentication
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","emaiil"]})(req,res)
})
router.get("/google/callback",AuthControler.googleCallbackController)

export const AuthRoutes = router;