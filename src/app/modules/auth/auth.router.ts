import { Router } from "express";
import { AuthControler } from "./auth.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()
router.post("/login",AuthControler.credentialLogin)
router.post("/logout",AuthControler.logout)
router.post("/refresh-token",AuthControler.getNewAccessToken)

router.post("/reset-password",checkAuth(...Object.values(Role)) ,AuthControler.resetPassword)

export const AuthRoutes = router;