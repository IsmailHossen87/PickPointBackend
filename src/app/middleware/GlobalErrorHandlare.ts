import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHalper/App.Error";
import { TErrorSources } from "../interface/error.types";
import { handleDuplicateError } from "../helpers/handle.Duplicate";
import { handleCastError } from "../helpers/handle.CastError";
import { handleZodError } from "../helpers/handle.Zoderror";
import { handleValidationError } from "../helpers/handle.Validation";


export const globalErrorHandler = ( err: any,req: Request, res: Response,next: NextFunction) => { 
    if(envVars.NODE_ENV === "development"){
        console.log(err)
    }

    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources: TErrorSources[] = [];

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    } else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    } else if (err instanceof AppError) {
        message = err.message;
        statusCode = err.statusCode;
    } else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err :envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
