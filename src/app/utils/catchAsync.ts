import { NextFunction, Request, Response } from "express"


type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>


// fn হচ্ছে তোমার মূল async function (যেমন: createUser, AllUsers)
// তুমি fn(req, res, next) কে Promise বানিয়ে .catch() করছো
// যদি error হয়, সেটা next(err) দিয়ে Express এর global error handler এর কাছে পাঠাও

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
        console.log(err)
        next(err)
    })
}

