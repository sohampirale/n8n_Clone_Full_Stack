import { Router } from "express";
import { getAllAvailaibleNodeActions } from "../controllers/action.controller.js";
const actionRouter = Router()

actionRouter.route('/list')
  .get(getAllAvailaibleNodeActions)

export default actionRouter;