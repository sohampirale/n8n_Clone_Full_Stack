import type { NextFunction, Request, Response } from "express";
import ApiResponse from "../lib/ApiResponse.js";
import jwt from "jsonwebtoken";

export default async function authMiddleware(req:Request,res:Response,next:NextFunction){
    try {
        
        const accessToken = req.cookies?.accessToken
        if(!accessToken){
            return res.status(400).json(
                new ApiResponse(false,"Access Token not found, login needed")
            )
        }
        const decodedInfo=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET!)
        req.user=decodedInfo
        next()
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(false,"Access token expired or invalid")
        )
    }
}