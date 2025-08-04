import AppError from "../../errorHalper/App.Error";
import { IAuthProvider, Iuser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { userSearchableFields } from "./userConstant";
import { QueryBuilder } from "../../utils/QueryBuilder";


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
// all  User
const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

// Updata user
const updateUser = async (userId: string, payload: Partial<Iuser>, decodedToken: JwtPayload) => { 
    // last moment Check
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
        if(userId !== decodedToken.userId){
            throw new AppError(401,"You are not Authorized")
        }
    }



    const ifUserExit = await User.findById(userId)
    if (!ifUserExit) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    // last moment Check
        if(decodedToken.role === Role.ADMIN && ifUserExit.role === Role.SUPER_ADMIN){
               throw new AppError(401,"You are not Authorized")
        }



    if (payload.role) {
        // সাধারণ ইউজার বা GUIDE যদি কারো role পরিবর্তন করতে চায়, বা নিজের role ADMIN বানাতে চায় — ❌ সেটা allow করা হবে না।
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    //  USER বা GUIDE এই sensitive field গুলা (active/inactive, delete, verify) change করতে পারবে না।
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }
    
    // ITS COMMENT ,because now change password API available
    // if (payload.password) {
    //     payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUTD)
    // }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    // user Image check
    if (payload.picture && ifUserExit.picture) {
        await deleteImageFromCloudinary(ifUserExit.picture)
    }
    return newUpdateUser;

}

// get me users
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password")
    return {
        data: user
    }
}
// get single users
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password")
    return {
        data: user
    }
}
export const userService = { createUser, getAllUsers, updateUser, getSingleUser, getMe }