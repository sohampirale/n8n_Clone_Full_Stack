import dotenv from "dotenv"
dotenv.config()
import express from "express"
import startServer from "./helpers/startServer.js"
const app =express()


app.get("./",(req,res)=>{
  res.send("Hello World")
})


startServer(app)