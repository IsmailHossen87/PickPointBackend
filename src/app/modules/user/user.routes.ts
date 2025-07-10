
import { Router } from "express";
import { UserControllers } from "./user.controler";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router()




router.post("/register",  validateRequest(createUserZodSchema) ,UserControllers.createUser)

router.get("/allUsers", UserControllers.AllUsers)


// উপরে router er name এর condition টা ঠীক রাখার জন্য
export const UserRoutes = router;