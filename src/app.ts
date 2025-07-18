import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/GlobalErrorHandlare"
import { notFound } from "./app/middleware/notFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"



const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use(passport.initialize())
app.use(passport.session())
app.use(expressSession({
    secret :"Your secret",
    resave:false,
    saveUninitialized:false
}))

// Router 
app.use("/api/v1",router)
app.get("/",async(req:Request,res:Response)=>{
    res.send("App is Running")
})

app.use(globalErrorHandler) 
// set Not found
app.use(notFound)
export default app;
