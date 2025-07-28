import AppError from "../../errorHalper/App.Error";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
const getTransectionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransectionId()
    const session = await Booking.startSession()
    await session.startTransaction()

    try {
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


        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAIND,
            transactionId: transactionId,
            amount
        }], { session })
        // After complete payment then Update payment status
        const updatedBooking = await Booking.
            findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session })
            //field name COLLECT Booking Interface
            .populate("user", "name email address phone")
            .populate("tour", "title costFrom")
            .populate("payment")

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userAddress = (updatedBooking?.user as any).address

        // AFTER TO DO WHEN WE COMPLETE SSL_COMMERZ FUNCTION
        const sslPayment = await SSLService.sslPaymentInit({
            address: userAddress,
            amount,
            email: user.email,
            name: user.name,
            phoneNumber: user.phone,
            transactionId: transactionId
        })
        // commit transection 
        await session.commitTransaction();  //transection done
        session.endSession()
        return {
            paymentUrl: sslPayment?.GatewayPageURL,   //AFTER sslCommerz 
            updatedBooking
        }
    } catch (error: any) {
        //Reverse all work 
        await session.abortTransaction()  // Roll Back
        session.endSession() //Transection off
        throw error   //mongoose already formoted the error data
    }

}

export const BookingService = { createBooking }