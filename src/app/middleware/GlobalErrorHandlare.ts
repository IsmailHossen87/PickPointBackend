import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHalper/App.Error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let stastusCode = 500;
    let message = "Something went wrong!! ";
    
    if(err instanceof AppError){
        stastusCode = err.statusCode
    }else if(err instanceof Error){
        stastusCode = 500;
        message = err.message
    }

    res.status(stastusCode).json({
        sucess: false,
        message,
        err,
        stack: envVars.NODE_ENV == "development" ? err.stack : null
    })
}