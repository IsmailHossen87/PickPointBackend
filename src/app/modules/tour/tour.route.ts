import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { TourController } from "./tour.controler";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = express.Router();
// tour type 
router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
); 
router.get("/tour-types", TourController.getAllTourTypes);
router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.updateTourType
);
router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType);



// tour
router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourZodSchema),
    TourController.createTour
);
// get allTour
router.get("/", TourController.getAllTours);
// updateTour
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
);
// single Tour get
router.get("/:slug",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),TourController.getSingleTour)
router.delete(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.deleteTour
);


export const TourRoutes = router