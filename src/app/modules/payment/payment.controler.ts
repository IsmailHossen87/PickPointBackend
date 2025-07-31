import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { envVars } from "../../config/env";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendReponse";
import httpStatus from "http-status-codes"

// future do payment
const initPayment = catchAsync(async(req:Request,res:Response)=>{
    const bookingId= req.params.bookingId;
    const result =await PaymentService.initPayment(bookingId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment Done sucessfully",
        data: result
      })
})
const successPayment = catchAsync(async(req:Request,res:Response)=>{
      const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }

})
const failPayment = catchAsync(async(req:Request,res:Response)=>{
      const query = req.query
    const result = await PaymentService.failPayment (query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})
const cancelPayment = catchAsync(async(req:Request,res:Response)=>{
  const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

export const paymentControler ={successPayment,failPayment,cancelPayment,initPayment}