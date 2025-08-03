import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const router = Router()
router.post("/login", AuthControler.credentialLogin)
router.post("/refresh-token", AuthControler.getNewAccessToken)
router.post("/logout", AuthControler.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControler.changePassword)
router.post("/setpassword", checkAuth(...Object.values(Role)), AuthControler.setPassword)
router.post("/forgot-password", AuthControler.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControler.resetPassword)

// google diye authentication
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is issue with uour account,Please contrct with out suppoet team!` }), AuthControler.googleCallbackController)

export const AuthRoutes = router;