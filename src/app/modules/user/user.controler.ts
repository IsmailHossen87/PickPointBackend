/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
 

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    try{
       
       const user =await userService.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            messege:"User created Sucessfully",
            user
        })
    }catch(err : any){
        // eslint-disable-next-line no-console
        console.log(err)
        next(err)
    }
}

export const UserControllers ={
    createUser
}