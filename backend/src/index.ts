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
  origin: process.env.FRONTEND_URL?.trim(),
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

startServer(app)

//TODO everytime in credentialController a credential is created for telegram we set telegram webhook url using the bot_token user gives us from frontend

// async function setWebhook() {
// //  FOR THE EACH INDIVIDUAL
//   const WEBHOOK_URL=`${process.env.BACKEND_URL}/api/v1/execution/soham3/telegram_webhook`

//   // const WEBHOOK_URL=`${process.env.BACKEND_URL}/api/v1/execution/telegram_webhook`
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
