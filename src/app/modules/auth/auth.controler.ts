import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendReponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthService.credentialLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged In sucessfully",
        data: loginInfo
    })
})

export const AuthControler = { credentialLogin }