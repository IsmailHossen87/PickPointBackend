import { Router } from "express";
import { UserControllers } from "./user.controler";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/moduler.config";
import { Role } from "./user.interface";

const router = Router();

// ✅ User Registration (Public)
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  multerUpload.single("file"),
  UserControllers.createUser
);

// ✅ Get All Users (Admin Only)
router.get(
  "/allUsers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
// ✅ Get  Users (Admin Only)
router.get(
  "/me",
   checkAuth(...Object.values(Role)),
  UserControllers.getMe
);

// ✅ Get Single User (Any Authenticated Role)
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);

// ✅ Update User (Any Authenticated Role)
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  UserControllers.updateUser
);

// ✅ Export Routes
export const UserRoutes = router;
