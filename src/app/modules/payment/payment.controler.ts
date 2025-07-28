import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const successPayment = catchAsync(async(req:Request,res:Response)=>{
    
})
const failPayment = catchAsync(async(req:Request,res:Response)=>{

})
const cancelPayment = catchAsync(async(req:Request,res:Response)=>{

})

export const paymentControler ={successPayment,failPayment,cancelPayment}