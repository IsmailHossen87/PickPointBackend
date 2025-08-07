import express from "express"
import { paymentControler } from "./payment.controler"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../user/user.interface"
const router =express.Router()

// Pore payment korbo tar jonno init
router.post("/init-payment/:bookingId",paymentControler.initPayment)
router.post("/success",paymentControler.successPayment)
router.post("/fail",paymentControler.failPayment)
router.post("/cancel",paymentControler.cancelPayment)
router.post("/validate-payment",paymentControler.validatePayment)

//Payment sucess hower por tar pdf er link
router.get("/invoice/:paymentId",checkAuth(...Object.values(Role)),paymentControler.getInvoiceDownload)
export const PaymentRoutes= router;