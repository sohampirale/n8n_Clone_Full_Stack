import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
const credentialsRouter =new Router()

credentialsRouter.route("./")
  .get()