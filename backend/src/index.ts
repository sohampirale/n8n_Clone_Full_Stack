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
import toolsRouter from "./routes/tool.route.js"
import cors from "cors"
import executionInstanceRouter from "./routes/execution.route.js"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/credential", credentialsRouter)
app.use("/api/v1/workflow", workflowRouter)
app.use("/api/v1/trigger", triggerRouter)
app.use("/api/v1/action", actionRouter)
app.use("/api/v1/tool", toolsRouter)
app.use("/api/v1/execution", executionInstanceRouter)

app.post("/telegram_webhook",(req,res)=>{
  console.log('webhook from telegram triggered ');
  const data = req.body;
  console.log('data received : ',data);
  return res.status(200).json({})
})

startServer(app)

// async function setWebhook() {
//   const WEBHOOK_URL="https://turbo-orbit-pjqrxj57rrr5399qw-3001.app.github.dev/telegram_webhook"
//   const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   console.log('Webhook set:', data);
// }


// setWebhook()

setTimeout(() => {
  //used seed functions here as needed 
  // createNodeActions()
  // createTriggerActions()
  // createCredentialForms()
  //  createToolForm()
}, 5000)
