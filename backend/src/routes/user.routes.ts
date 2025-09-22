import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userSignin, userSignup } from "../controllers/user.controller.js";
const userRouter = Router()

userRouter.route("./signup")
  .post(userSignup)

userRouter.route('./signin')
  .post(userSignin)

export default userRouter;