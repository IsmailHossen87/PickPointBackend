import express from "express"
import { checkAuth } from "../../middleware/checkAuth"
import { createBookingZodSchema } from "./booking.validation"
import { Role } from "../user/user.interface"
import { validateRequest } from "../../middleware/validateRequest"
import { BookingControler } from "./booking.controler"

const router = express.Router()

router.post("/", checkAuth(...Object.values(Role)),
validateRequest(createBookingZodSchema),
    BookingControler.createBooking)

export const BookingRoutes = router