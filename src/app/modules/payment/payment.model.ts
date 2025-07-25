import { model, Schema } from "mongoose";
import { IPament, PAYMENT_STATUS } from "./payment.interface";

const PaymentSchema = new Schema<IPament>({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required:true
    },
    transactionId: {
        type: String,
        required:true,
        unique:true
    },
    amount: {
        type: Number,
        required:true
    },
    status: {
        type:String,
        enum:Object.values(PAYMENT_STATUS),
        default:PAYMENT_STATUS.UNPAIND
    },
    paymentGatwayData: {
        type: Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String
    },
}, {
    versionKey: false,
    timestamps: true
})

export const Booking  = model<IBooking>("Booking",bookingSchema)