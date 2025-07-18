import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendReponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"
import AppError from "../../errorHalper/App.Error"
import { setAuthCookie } from "../../utils/setCookie"



const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthService.credentialLogin(req.body)
    // link
    setAuthCookie(res, loginInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged In sucessfully",
        data: loginInfo
    })
})
// accessToken
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refrestToken = req.cookies.refreshToken
    if (!refrestToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookied")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refrestToken)
    // link
    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived sucessfully",
        data: tokenInfo
    })
})
// For LogOut
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken",
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
    res.clearCookie("refreshToken",
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged Out sucessfully",
        data: null,
    })
})
// Reset Password
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword
     await AuthService.resetPassword(oldPassword,newPassword,decodedToken)

   
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed sucessfully",
        data: null,
    })
})

export const AuthControler = { credentialLogin, getNewAccessToken,logout,resetPassword }