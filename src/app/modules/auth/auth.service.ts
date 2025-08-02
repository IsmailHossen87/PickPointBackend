/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHalper/App.Error";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"

import { createNewAccessTokenWinthRefreshToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/send.Email";



// accessToken and Refresh Token Business Logic 

// all word for password

// const credentialLogin = async (payload: Partial<Iuser>) => {
//    const { email, password } = payload;

//    const isUserExites = await User.findOne({ email })
//    if (!isUserExites) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Email  does not Exit")
//    }

//    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExites.password as string)

//    if (!isPasswordMatched) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
//    }

//    const userTokens = createUserToken(isUserExites)

//    // eslint-disable-next-line @typescript-eslint/no-unused-vars
//    const { password: pass, ...rest } = isUserExites.toObject();

//    return {
//       // User,
//       accessToken: userTokens.accessToken,
//       refreshToken: userTokens.refreshToken,
//       user: rest
//    }
// }


const getNewAccessToken = async (refreshToken: string) => {

   const newAccessToken = await createNewAccessTokenWinthRefreshToken(refreshToken)
   return {
      accessToken: newAccessToken

   }
}

// changePassword
const changePassword = async (oldPassword: string, newPassword: string, docodedToken: JwtPayload) => {
   const user = await User.findById(docodedToken.userId)


   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
   const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

   if (!isOldPasswordMatch) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doed not match")
   }
   // hide for password
   user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUTD));
   user!.save()
}
// ResetPassword
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
   if (payload.id != decodedToken.userId) {
      throw new AppError(401, "You can not reset your password")
   }

   const isUserExist = await User.findById(decodedToken.userId)
   if (!isUserExist) {
      throw new AppError(401, "User does not exist")
   }

   const hashedPassword = await bcryptjs.hash(
      payload.newPassword,
      Number(envVars.BCRYPT_SALT_ROUTD)
   )

   isUserExist.password = hashedPassword;

   await isUserExist.save()
}
// SetPassword
const setrPassword = async (userId: string, plainPassword: string) => {
   const user = await User.findById(userId);
   if (!user) { throw new AppError(404, "User not found"); }

   // 2️⃣: Prevent setting password if user already has one and used Google to sign in
   if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
      throw new AppError(400, "You have already set your password. Now you can change it from the password update option.");
   }

   const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUTD));

   // 4️⃣: Create a new credentials-based auth provider
   const credentialProvider: IAuthProvider = { provider: "credentials", providerId: user.email, };

   // 5️⃣: Add the new auth provider to existing auths
   const auths: IAuthProvider[] = [...user.auths, credentialProvider];

   // 6️⃣: Update the user's password and auths list
   user.password = hashedPassword;
   user.auths = auths;

   // 7️⃣: Save the updated user info in the database
   await user.save();
};


// forgot
const forgotPassword = async (email: string) => {
   const isUserExites = await User.findOne({ email })

   if (!isUserExites) {
      throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit")
   }
   if (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.isActive}`)
   }
   if (isUserExites.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
   }
   if (!isUserExites.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
   }

   // sob pass korte parle Token banate hobe
   const JwtPayload = {
      userId: isUserExites._id,
      email:isUserExites.email,
      role : isUserExites.role
   }
   const resetToken = jwt.sign(JwtPayload,envVars.JWT_ACCESS_SECRET,{expiresIn:"10m"})
   const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExites._id}&token=${resetToken}`

   sendEmail({
      to:isUserExites.email,
      subject:"Password Reset",
      templateName:"forgetPassword",
      templateData :{
         name:isUserExites.name,
         resetUILink          //Link Pathano hosse
      }
   })
}



export const AuthService = { changePassword, getNewAccessToken, resetPassword, setrPassword, forgotPassword }
