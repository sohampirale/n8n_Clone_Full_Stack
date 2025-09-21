import {Router} from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createWorkflow, getAllWorkflowsOfUser, updateWorkflow } from "../controllers/workflow.controllers.js"
const workflowRouter = Router()

workflowRouter.route("./")
  .get(authMiddleware,getAllWorkflowsOfUser)
  .post(authMiddleware,createWorkflow)



workflowRouter.route('/:slug')
  .put(authMiddleware,updateWorkflow)