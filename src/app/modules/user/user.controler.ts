
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendReponse";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.createUser(req.body)

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

export const UserControllers = { createUser, AllUsers }