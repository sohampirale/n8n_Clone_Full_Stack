import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllAvailaibleToolForms } from "../controllers/tool.controller.js";
const toolsRouter = Router()

toolsRouter.route('/list')
  .get(getAllAvailaibleToolForms)

export default toolsRouter;