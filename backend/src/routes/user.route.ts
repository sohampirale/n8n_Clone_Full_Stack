import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userSignin, userSignup } from "../controllers/user.controller.js";
import ApiResponse from "../lib/ApiResponse.js";
const userRouter = Router()

userRouter.route("/signup")
  .post(userSignup)

userRouter.route('/signin')
  .post(userSignin)

userRouter.route("/me")
  .get(authMiddleware,(req,res)=>{
    res.status(200).json(
      new ApiResponse(true,'User is logged in',{
        user:req.user
      })
    )
  })

export default userRouter;