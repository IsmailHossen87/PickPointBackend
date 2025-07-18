import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/GlobalErrorHandlare"
import { notFound } from "./app/middleware/notFound"
import cookieParser from "cookie-parser"



const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

// Router 
app.use("/api/v1",router)
app.get("/",async(req:Request,res:Response)=>{
    res.send("App is Running")
})

app.use(globalErrorHandler) 
// set Not found
app.use(notFound)
export default app;
