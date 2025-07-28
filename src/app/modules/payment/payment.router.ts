import express from "express"
const router =express.Router()

router.post("/success")

router.post("/fail")

router.post("/cancel")
export const PaymentRoutes= router;