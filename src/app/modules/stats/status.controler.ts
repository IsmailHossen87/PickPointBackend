import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { StatusService } from "./status.service";


const getUserStatus = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatusService.getUserStatus()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All users retrived',
        data: stats,
    });
})
const getTourStatus = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatusService.getTourStatus()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Tour retrived',
        data: stats,
    });
})

const getBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatusService.getBookingStatus()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice Download URL retrieved Sucessfully',
        data: stats,
    });
})
const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatusService.getPaymentStatus()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Invoice Download URL retrieved Sucessfully',
        data: stats,
    });
})



export const StatusControler = { getBookingStatus, getPaymentStatus, getUserStatus, getTourStatus }