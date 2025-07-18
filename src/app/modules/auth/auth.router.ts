import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import passport from "passport";

const router = Router()
router.post("/login",AuthControler.credentialLogin)
router.post("/logout",AuthControler.logout)
router.post("/refresh-token",AuthControler.getNewAccessToken)

// google diye authentication
router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","emaiil"]})(req,res)
})
router.get("/google/callback",AuthControler.googleCallbackController)

export const AuthRoutes = router;