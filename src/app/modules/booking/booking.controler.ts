
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req:Request,res:Response)=>{
    const decodedToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body,decodedToken.userId)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:"Booking created Sucessfully",
        data:booking
    })
})

export const BookingControler ={
    createBooking
}