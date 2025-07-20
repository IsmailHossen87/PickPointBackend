import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendReponse"
import httpStatus from "http-status-codes"
import AppError from "../../errorHalper/App.Error"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserToken } from "../../utils/userToken"
import { envVars } from "../../config/env"
import { AuthService } from "./auth.service"
import passport from "passport"




const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const loginInfo = await AuthService.credentialLogin(req.body)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    passport.authenticate("local",async(err:any,user:any,info:any)=>{ 
        // err,user and info its come from passport

        if(err){
            return  next(new AppError(401,err))
        }
        if(!user){ 
            // return next(new AppError(401,info.message))
             throw new Error(err)
        }

        const userTokens  = await createUserToken(user)

        const {password:pass,...rest} = user.toObject()
    
    setAuthCookie(res, userTokens)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged In sucessfully",
        data: {
            accessToken:userTokens.accessToken,
            refrestToken:userTokens.refreshToken,
            user: rest
        }
    })
    })(req,res,next)
    // link

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


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // after login change path
    let redirectTo = req.query.state ? req.query.state as string :"/" 
    if(redirectTo.startsWith("/")){
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user; 
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    const tokenInfo = await createUserToken(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})




export const AuthControler = { credentialLogin, getNewAccessToken, logout, googleCallbackController ,resetPassword}


