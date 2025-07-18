import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import passport from "passport";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()
router.post("/login",AuthControler.credentialLogin)
router.post("/logout",AuthControler.logout)
router.post("/refresh-token",AuthControler.getNewAccessToken) 
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControler.resetPassword)

// google diye authentication
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","emaiil"]})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),AuthControler.googleCallbackController)

export const AuthRoutes = router;