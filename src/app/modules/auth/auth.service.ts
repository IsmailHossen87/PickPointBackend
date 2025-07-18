/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHalper/App.Error";
import { Iuser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"

import { createNewAccessTokenWinthRefreshToken, createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// accessToken and Refresh Token Business Logic
const credentialLogin = async (payload: Partial<Iuser>) => {
   const { email, password } = payload;

   const isUserExites = await User.findOne({ email })
   if (!isUserExites) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email  does not Exit")
   }

   const isPasswordMatched = await bcryptjs.compare(password as string, isUserExites.password as string)

   if (!isPasswordMatched) {
      throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
   }

   const userTokens = createUserToken(isUserExites)

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { password: pass, ...rest } = isUserExites.toObject();

   return {
      // User,
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
      user: rest
   }
}


const getNewAccessToken = async (refreshToken: string) => {

   const newAccessToken =await createNewAccessTokenWinthRefreshToken(refreshToken)
   return {
      accessToken: newAccessToken

   }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUTD))

    user!.save();


}

export const AuthService = { credentialLogin, getNewAccessToken,resetPassword}