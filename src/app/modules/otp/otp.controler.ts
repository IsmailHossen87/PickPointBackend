import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { otpService } from "./otp.service";

// SEND OTP
const sendOTP = catchAsync(async(req:Request,res:Response)=>{  
    const {email,name} = req.body
    await otpService.sendOTP(email,name)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'OTP sent successfully',
        data: null,
    });
})
// verify OTP
const verifyOTP = catchAsync(async(req:Request,res:Response)=>{ 
    const {email,otp} = req.body
    await otpService.verifyOTP(email,otp)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'OTP verify successfully',
        data: null,
    });
})

export const otpControler = {sendOTP ,verifyOTP}