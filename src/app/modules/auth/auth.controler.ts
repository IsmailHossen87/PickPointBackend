/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHalper/App.Error";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { AuthService } from "./auth.service";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

// 🔐 Credential Login using passport local strategy
const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(err.statusCode || 401, err.message));
        }
        if (!user) {
            return next(new AppError(401, info.message));
        }

        const userTokens = await createUserToken(user);
        const { password: pass, ...rest } = user.toObject();

        // 🍪 Set tokens in cookie
        setAuthCookie(res, userTokens);

        // 📤 Send response with tokens and user data
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged In successfully",
            data: {
                accessToken: userTokens.accessToken,
                refrestToken: userTokens.refreshToken,
                user: rest
            }
        });
    })(req, res, next);
});

// 🔄 Get New Access Token from refresh token
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refrestToken = req.cookies.refreshToken;
    if (!refrestToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies");
    }

    const tokenInfo = await AuthService.getNewAccessToken(refrestToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved successfully",
        data: tokenInfo
    });
});

// 🚪 Logout User: clear cookies
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: null
    });
});

// 🔁 Change Password: old password required
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { newPassword, oldPassword } = req.body;

    await AuthService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

// 🔁 Reset Password: through reset link
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

// 🔐 Set Password: first-time setup for Google users
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;

    await AuthService.setPassword(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password set successfully",
        data: null
    });
});

// 📧 Forgot Password: sends reset email link
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reset email sent successfully",
        data: null
    });
});

// 🔁 Google OAuth2 Callback: redirects after login
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : "/";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = await createUserToken(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

// 🚀 Export all auth-related controllers
export const AuthControler = {
    credentialLogin,
    getNewAccessToken,
    logout,
    googleCallbackController,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword
};