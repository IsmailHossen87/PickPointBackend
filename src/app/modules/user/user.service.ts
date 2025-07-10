import AppError from "../../errorHalper/App.Error";
import { IAuthProvider, Iuser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"

const createUser =async(payload : Partial<Iuser>) =>{ 
     const {email,password,...rest} = payload;
     const isUserExites = await User.findOne({email})

     if(isUserExites){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exit")
     }
      
     const hashePassword =await bcryptjs.hash(password as string,10 )

     const AuthProvider: IAuthProvider= {provider:"credentials",providerId:email as string}

        const user = await User.create({
            email,
            password:hashePassword,
            auths:[AuthProvider]
            ,...rest
        })
    return user
}
// get all users
const getAllUsers = async()=>{
    const users = await User.find({})
    const totalUsers = await User.countDocuments()
    return {
        data:users,
        meta:{
            total:totalUsers
        }
    }
}
export const userService = {createUser,getAllUsers}