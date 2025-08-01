
import { UserControllers } from "./user.controler";

import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { Router } from "express";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/moduler.config";



const router = Router()


// Zod validation
router.post("/register",
    validateRequest(createUserZodSchema),
    multerUpload.single("file"),
    UserControllers.createUser)

// accessToken
router.get("/allUsers", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.AllUsers)
// as if all person can update so use spreed Oparetor
router.patch("/:id",
     validateRequest(updateUserZodSchema),
      checkAuth(...Object.values(Role)),
      multerUpload.single("file"),
       UserControllers.updateUser)


// উপরে router er name এর condition টা ঠীক রাখার জন্য
export const UserRoutes = router;