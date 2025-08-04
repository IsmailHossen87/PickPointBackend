import { uploadBufferCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHalper/App.Error";
import { generatepdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/send.Email";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { Iuser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes"

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found.You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)
    // Collect Booking
    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).address

    // AFTER TO DO WHEN WE COMPLETE SSL_COMMERZ FUNCTION
    const sslPayment = await SSLService.sslPaymentInit({
        address: userAddress,
        amount: payment.amount,
        email: userEmail,
        name: userName,
        phoneNumber: userPhoneNumber,
        transactionId: payment.transactionId
    })
    return {
        paymentUrl: sslPayment?.GatewayPageURL,   //AFTER sslCommerz 
    }

};
const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session })
        // update Data 
        const updateBooking = await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            ).populate("tour", "title")
            .populate("user", "name email")

        if (!updatedPayment) {
            throw new AppError(401, "Payment not found")
        }

        if (!updateBooking) {
            throw new AppError(401, "Booking not found")
        }



        // PDF sent start
        const invoiceData: IInvoiceData = {
            bookingDate: updateBooking.createdAt as Date,
            guestCount: updateBooking?.guestCount,
            totalAmount: updatedPayment?.amount,
            tourTitle: (updateBooking?.tour as unknown as ITour).title,
            transactionId: updatedPayment?.transactionId,
            userName: (updateBooking?.user as unknown as Iuser).name,
        }

        const pdfBuffer = await generatepdf(invoiceData)

        //FOR store data base
        const cloudinaryResult = await uploadBufferCloudinary(pdfBuffer, "invoice")
        if (!cloudinaryResult) {
            throw new AppError(401, "Error Uploading pdf")
        }
        //ekhon payment er INVOICE URL ke Update korte hobe
        await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session })


        await sendEmail({
            to: (updateBooking?.user as unknown as Iuser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [{
                filename: "invoice.pdf",
                content: pdfBuffer,
                contentType: "application/pdf"
            }]
        })
        // PDF sent end


        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};
const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCEL,
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};
// DOWNLOAD PDF
const invoiceService = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};

export const PaymentService = { successPayment, failPayment, cancelPayment, initPayment, invoiceService }