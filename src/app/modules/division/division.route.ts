import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

const router = Router()
// Post division
router.post("/create",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
validateRequest(createDivisionSchema),
DivisionController.createDivision)
// all division get
router.get("/",DivisionController.getAllDivision)

// single division get
router.get("/:slug",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),DivisionController.getSingleDivision)
// update
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    DivisionController.updatedDivision
);
// delete
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);


export const DivisionRoute = router;