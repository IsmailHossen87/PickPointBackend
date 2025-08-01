import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";


// Zod middleware 
export const validateRequest = (createUserZodSchema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try { 
    
        // req.body = JSON.parse(req.body.data) || req.body  
        if(req.body.data){
            req.body = JSON.parse(req.body.data)
        }
        req.body = await createUserZodSchema.parseAsync(req.body)
        next()
    } catch (err) {
        next(err)
    }
}
