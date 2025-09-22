import dotenv from "dotenv"
dotenv.config()
import express from "express"
import startServer from "./helpers/startServer.js"
import { createNodeActions, createTriggerActions } from "./helpers/seed.js"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"

const app =express()
app.use(express.json())
app.use(cookieParser())

app.get("./",(req,res)=>{
  res.send("Hello World")
})

app.use("./api/v1/user",userRouter)


startServer(app)

setTimeout(()=>{
  //used seed functions here as needed 
  // createNodeActions()
  // createTriggerActions()
},5000)