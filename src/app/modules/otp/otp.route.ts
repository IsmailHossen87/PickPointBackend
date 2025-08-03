import express from "express"
import { otpControler } from "./otp.controler";

const router = express.Router()
router.post("/send",otpControler.sendOTP)
router.post("/verify",otpControler.verifyOTP)  //frontend ->redis ->backend

export const OtpRouter = router;