import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { optService } from "./otp.service";

const sendOTP = catchAsync(async(req:Request,res:Response)=>{  
    const {email,name} = req.body
    await optService.sendOTP(email,name)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'OTP sent successfully',
        data: null,
    });
})
const verifyOTP = catchAsync(async(req:Request,res:Response)=>{ 


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'OTP verify successfully',
        data: null,
    });
})

export const otpControler = {sendOTP ,verifyOTP}