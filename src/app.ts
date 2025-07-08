import express, { Request, Response } from "express"


const app = express()

app.get("/",async(req:Request,res:Response)=>{
    res.send("App is Running")
})

export default app;
