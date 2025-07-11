import { Router } from "express";
import { AuthControler } from "./auth.controler";

const router = Router()
router.post("/login",AuthControler.credentialLogin)

export const AuthRoutes = router;