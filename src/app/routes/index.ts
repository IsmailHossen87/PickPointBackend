import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.router"
import { DivisionRoute } from "../modules/division/division.route"
import { TourRoutes } from "../modules/tour/tour.route"
import { BookingRoutes } from "../modules/booking/booking.router"
import { PaymentRoutes } from "../modules/payment/payment.router"

export const router = Router()

const moduleRoutes = [
    { path: "/user", route: UserRoutes },
    // for login,register etc
    { path: "/auth", route: AuthRoutes },
    { path: "/division", route: DivisionRoute },
    { path: "/tour", route: TourRoutes },
    { path: "/booking", route: BookingRoutes },
    { path: "/payment", route: PaymentRoutes },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

