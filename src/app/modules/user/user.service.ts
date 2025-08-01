import AppError from "../../errorHalper/App.Error";
import { IAuthProvider, Iuser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";


const createUser = async (payload: Partial<Iuser>) => {
    const { email, password, ...rest } = payload;
    const isUserExites = await User.findOne({ email })
    if (isUserExites) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exit")     
    }
    //  for password
    const hashePassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUTD))

    //  when the person login email then ID = email,Email providerId 
    const AuthProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashePassword,
        // একজন ইউজার হয়তো বিভিন্ন উপায়ে (credentials, Google, GitHub ইত্যাদি) লগইন করতে পারে। auths অ্যারেতে প্রতিটা পদ্ধতির রেকর্ড রাখা হয়।
        auths: [AuthProvider]
        , ...rest
    })
    return user
}


// Updata user
const updateUser = async (userId: string, payload: Partial<Iuser>, decodedToken: JwtPayload) => {
    const ifUserExit = await User.findById(userId)
    if (!ifUserExit) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }


    if (payload.role) {
        // সাধারণ ইউজার বা GUIDE যদি কারো role পরিবর্তন করতে চায়, বা নিজের role ADMIN বানাতে চায় — ❌ সেটা allow করা হবে না।
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
        //  ADMIN যদি আরেকজনকে SUPER_ADMIN করতে চায় — ❌ সেটাও allow না।
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    //  USER বা GUIDE এই sensitive field গুলা (active/inactive, delete, verify) change করতে পারবে না।
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUTD)
    }
    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }) 
    // user Image check
    if(payload.picture && ifUserExit.picture){
        await deleteImageFromCloudinary(ifUserExit.picture)
    }
    return newUpdateUser;

}
// get all users
const getAllUsers = async () => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}
export const userService = { createUser, getAllUsers, updateUser }