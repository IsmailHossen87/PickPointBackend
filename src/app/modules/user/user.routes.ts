import { Router } from "express";
import { UserControllers } from "./user.controler";

const router =Router()
router.post("/register",UserControllers.createUser)
router.get("/allUsers",UserControllers.AllUsers)


// উপরে router er name এর condition টা ঠীক রাখার জন্য
export const UserRoutes = router;