import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { envVars } from "../../config/env";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendReponse";
import httpStatus from "http-status-codes"
import { SSLService } from "../sslCommerz/sslCommerz.service";

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

// PDF DOWNLOAD LINK
const getInvoiceDownload = catchAsync(async(req:Request,res:Response)=>{
    const {paymentId} = req.body;
    const result = await PaymentService.invoiceService(paymentId)

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice Download URL retrieved Sucessfully',
        data: result,
    });
})
// last e
const validatePayment = catchAsync(async(req:Request,res:Response)=>{
    const result = await SSLService.validatePayment(req.body)

    console.log("SSL COMMERCE IPN",req.body)
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Payment Validated Sucessfully',
        data: result,
    });
})

export const paymentControler ={successPayment,failPayment,cancelPayment,initPayment,getInvoiceDownload,validatePayment}