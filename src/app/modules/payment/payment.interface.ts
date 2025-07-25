import { Types } from "mongoose"

export enum PAYMENT_STATUS {
    PAIND = "PAIND",
    UNPAIND = "UNPAIND",
    CANCEL = "CANCEL",
    // COMPLETE = "COMPLETE",
    FAILED = "FAILED",
    REFFUNDED="REFFUNDED"
}


export interface IPament {
    booking: Types.ObjectId,
    transactionId: string,
    amount: number,
    paymentGatwayData?: any,
    invoiceUrl?: string,
    status:
}