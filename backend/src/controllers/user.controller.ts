
import { response, type Request, type Response } from "express";
import ApiResponse from "../lib/ApiResponse.js";
import generateAccessToken  from "../helpers/token.js";
import User from "../models/user.model.js";

export async function userSignup(req: Request, res: Response) {
    try {
      const {username,email,password}=req.body

      const existingUser = await User.findOne({
        $or:[
          {email},
          {username}
        ]
      })

      if(existingUser){
        return res.status(409).json(
                new ApiResponse(false, "User already exists with that username or email")
            )
      }

      const user = await User.create({
        username,
        email,
        password
      })

      const accessToken=generateAccessToken({
        _id:user._id,
        username
      })

      return res
        .cookie("accessToken", accessToken, {
            httpOnly: true, 
        })
        .status(201).json(
            new ApiResponse(true, "User signup successfully")
        )
    } catch (error) {
        console.log('ERROR :: ',error);
        
        return res.status(500).json(
            new ApiResponse(true, "Failed to signup the user")
        )
    }
}

export async function userSignin(req: Request, res: Response) {
    try {
        const { identifier, password } = req.body;

        if(!identifier || !password){
          return res.status(400).json(
            new ApiResponse(false,"Invalid/Insufficient data provided")
          )
        }

        const user =await User.findOne({
          $or: [
            { email: identifier },
            { username: identifier }
          ]
        })
        
        if(!user){
          return res.status(404).json(
            new ApiResponse(false,"User not found with given username or email")
          )
        }

        if(!await user.comparePassword(password)){
          return res.status(401).json(
            new ApiResponse(false,"Incorrect password")
          )
        }

        const accessToken=generateAccessToken({
            _id:user._id,
            username:user.username
        })

        return res
          .cookie("accessToken",accessToken,{
              httpOnly: true, 
          })
          .status(200).json(
              new ApiResponse(true, "Login successfull")
          )
        
    } catch (error) {
        console.log('ERROR :: userSignin : ',error);
        
        return res.status(500).json(
            new ApiResponse(false, "Failed to signin")
        )
    }
}