import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.router"

export const router = Router()

const moduleRoutes = [
    { path:"/user",route : UserRoutes },
    // for login,register etc
    { path:"/auth",route : AuthRoutes }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})

