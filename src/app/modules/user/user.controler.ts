
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";
import { JwtPayload } from "jsonwebtoken";
import { Iuser } from "./user.interface";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
  const payload :Iuser= {
    ...req.body,
    picture:req.file?.path
  }
  const user = await userService.createUser(payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created sucessfully",
    data: user
  })
})


const AllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrived sucessfully",
    data: result.data,
    meta: result.meta
  })

});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
   const payload :Iuser= {
    ...req.body,
    picture:req.file?.path
  }
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifyedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload

  const verifyedToken = req.user

  const user = await userService.updateUser(userId,payload,verifyedToken as JwtPayload) 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User updated sucessfully",
    data: user
  })
})


export const UserControllers = { createUser, AllUsers,updateUser }