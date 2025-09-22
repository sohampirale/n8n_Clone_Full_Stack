import { Router } from "express";
import { getAllAvailaibleTriggerActions } from "../controllers/trigger.controller.js";
const triggerRouter = Router()

triggerRouter.route('/list')
  .get(getAllAvailaibleTriggerActions)

export default triggerRouter;