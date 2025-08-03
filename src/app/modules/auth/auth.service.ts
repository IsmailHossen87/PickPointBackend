/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHalper/App.Error";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWinthRefreshToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/send.Email";

// 🔄 Get a new access token using a valid refresh token
const getNewAccessToken = async (refreshToken: string) => {
   const newAccessToken = await createNewAccessTokenWinthRefreshToken(refreshToken);
   return {
      accessToken: newAccessToken
   }
}

// 🔐 Change Password: Requires old password and new password
const changePassword = async (oldPassword: string, newPassword: string, docodedToken: JwtPayload) => {
   const user = await User.findById(docodedToken.userId);

   // 🔍 Check if old password matches
   const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);

   if (!isOldPasswordMatch) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doed not match");
   }

   // 🔄 Hash and update the new password
   user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUTD));
   user!.save();
}

// 🔁 Reset Password from a reset link (token based)
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
   if (payload.id != decodedToken.userId) {
      throw new AppError(401, "You can not reset your password");
   }

   const isUserExist = await User.findById(decodedToken.userId);
   if (!isUserExist) {
      throw new AppError(401, "User does not exist");
   }

   // 🔄 Hash and set new password
   const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUTD));
   isUserExist.password = hashedPassword;
   await isUserExist.save();
}

// 🔐 Set initial password for Google signup users
const setPassword = async (userId: string, plainPassword: string) => {
   const user = await User.findById(userId);
   if (!user) {
      throw new AppError(404, "User not found");
   }

   // 🚫 Prevent setting password if already set via Google
   if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
      throw new AppError(400, "You have already set your password. Now you can change it from the password update option.");
   }

   const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUTD));

   // ➕ Create credential provider and attach to user
   const credentialProvider: IAuthProvider = { provider: "credentials", providerId: user.email };
   const auths: IAuthProvider[] = [...user.auths, credentialProvider];

   // 💾 Update user info
   user.password = hashedPassword;
   user.auths = auths;
   await user.save();
};

// 📧 Forgot Password: Validates and sends email with reset link
const forgotPassword = async (email: string) => {
   const isUserExites = await User.findOne({ email });

   if (!isUserExites) {
      throw new AppError(httpStatus.BAD_REQUEST, "User  does not Exit");
   }
   if (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExites.isActive}`);
   }
   if (isUserExites.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
   }
   if (!isUserExites.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
   }

   // ✅ All checks passed: generate token and send email
   const JwtPayload = {
      userId: isUserExites._id,
      email: isUserExites.email,
      role: isUserExites.role
   };

   const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" });
   const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExites._id}&token=${resetToken}`;

   // 📤 Send password reset email with template
   sendEmail({
      to: isUserExites.email,
      subject: "Password Reset",
      templateName: "forgetPassword",
      templateData: {
         name: isUserExites.name,
         resetUILink
      }
   });
}

// 🔄 Export all Auth-related services
export const AuthService = {
   changePassword,
   getNewAccessToken,
   resetPassword,
   setPassword,
   forgotPassword
};
