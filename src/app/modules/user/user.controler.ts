
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


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await userService.getAllUsers(query as Record<string, string>);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const result = await userService.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrived sucessfully",
    data: result.data,
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
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

    const id = req.params.id;
    const result = await userService.getSingleUser(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User updated sucessfully",
    data: result.data
  })
})


export const UserControllers = { createUser, getAllUsers,updateUser ,getSingleUser,getMe}