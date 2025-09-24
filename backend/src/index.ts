import dotenv from "dotenv"
dotenv.config()
import express from "express"
import startServer from "./helpers/startServer.js"
import { createCredentialForms, createNodeActions, createToolForm, createTriggerActions } from "./helpers/seed.js"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
import credentialsRouter from "./routes/credential.route.js"
import workflowRouter from "./routes/workflow.route.js"
import triggerRouter from "./routes/trigger.route.js"
import actionRouter from "./routes/action.route.js"

const app =express()
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
  res.send("Hello World")
})

app.use("/api/v1/user",userRouter)
app.use("/api/v1/credential",credentialsRouter)
app.use("/api/v1/workflow",workflowRouter)
app.use("/api/v1/trigger",triggerRouter)
app.use("/api/v1/action",actionRouter)

startServer(app)

setTimeout(()=>{
  //used seed functions here as needed 
  // createNodeActions()
  // createTriggerActions()
  // createCredentialForms()
  // createToolForm()
},5000)