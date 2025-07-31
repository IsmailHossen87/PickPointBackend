import express from "express"
import { paymentControler } from "./payment.controler"
const router =express.Router()

// Pore payment korbo tar jonno init
router.post("/init-payment/:bookingId",paymentControler.initPayment)
router.post("/success",paymentControler.successPayment)
router.post("/fail",paymentControler.failPayment)
router.post("/cancel",paymentControler.cancelPayment)
export const PaymentRoutes= router;