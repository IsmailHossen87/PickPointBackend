import express from "express"
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { StatusControler } from "./status.controler";

const router = express.Router()

router.get("/user",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    StatusControler.getUserStatus
)
router.get("/tour",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    StatusControler.getTourStatus
)
router.get("/booking",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    StatusControler.getBookingStatus
)
router.get("/payment",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    StatusControler.getPaymentStatus
)





export const statusRoutes = router;