import {Router} from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
const workflowRouter = Router()

workflowRouter.route("./")
  .get(authMiddleware,getAllWorkflowsOfUser)
  .post(authMiddleware,createWorkflow)

