import { Types } from "mongoose"

export enum PAYMENT_STATUS {
    PAIND = "PAIND",
    UNPAIND = "UNPAIND",
    CANCEL = "CANCEL",
    FAILED = "FAILED",
    REFFUNDED="REFFUNDED"
}


export interface IPament {
    booking: Types.ObjectId,
    transactionId: string,
    amount: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGatewayData?: any,
    invoiceUrl?: string,
    status:PAYMENT_STATUS
}