import AppError from "../../errorHalper/App.Error";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model";
import { Tour } from "../tour/tour.model";
const getTransectionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransectionId()
    const user = await User.findById(userId);

    if (!user?.phone || !user.address) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to Book a Tour")
    }
    // tour
    const tour = await Tour.findById(payload.tour).select("costFrom")
    if (!tour?.costFrom) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found")
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!)


    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAIND,
        transactionId: transactionId,
        amount
    })
    // After complete payment then Update payment status
    const updatedBooking = await Booking.
    findByIdAndUpdate(
        booking._id,
         { payment: payment._id }, 
         { new: true, runValidators: true }) 
         //field name COLLECT Booking Interface
         .populate("user","name email address phone")
         .populate("tour","title costFrom")
         .populate("payment") 

    return updatedBooking
}

export const BookingService = { createBooking }