import { Router } from "express";
import { AuthControler } from "./auth.controler";

const router = Router()
router.post("/login",AuthControler.credentialLogin)
router.post("/logout",AuthControler.logout)
router.post("/refresh-token",AuthControler.getNewAccessToken)

export const AuthRoutes = router;