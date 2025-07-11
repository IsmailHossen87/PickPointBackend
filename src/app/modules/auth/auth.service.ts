import AppError from "../../errorHalper/App.Error";
import { Iuser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
const credentialLogin =async(payload:Partial<Iuser>)=>{
    const {email,password} = payload;

     const isUserExites = await User.findOne({email})
         if(!isUserExites){
            throw new AppError(httpStatus.BAD_REQUEST,"Email  does not Exit")
         }

        const isPasswordMatched = await bcryptjs.compare(password as string,isUserExites.password as string)

          if(!isPasswordMatched){
            throw new AppError(httpStatus.BAD_REQUEST,"Incorrect Password")
         }
        //  jwt token empliment
         const jwtPayload ={
            userId:isUserExites._id,
            email:isUserExites.email,
            role:isUserExites.role
         }
         const accessToken = jwt.sign(jwtPayload,"secret",{
            expiresIn:"1d"
         })
      

         return{
            // User,
          accessToken
         }
}

export const AuthService ={credentialLogin}