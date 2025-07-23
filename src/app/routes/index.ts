import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.router"
import { DivisionRoute } from "../modules/division/division.route"
import { TourRoutes } from "../modules/tour/tour.route"

export const router = Router()

const moduleRoutes = [
    { path:"/user",route : UserRoutes },
    // for login,register etc
    { path:"/auth",route : AuthRoutes },
    { path:"/division",route : DivisionRoute },
      { path: "/tour",route: TourRoutes }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})

