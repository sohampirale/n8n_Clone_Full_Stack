import type { Request, Response } from "express";
import { NodeAction } from "../models/node.model.js";
import ApiResponse from "../lib/ApiResponse.js";

export async function getAllAvailaibleNodeActions(req:Request,res:Response){
  try {
    const allNodeActions = await NodeAction.find({publicallyAvailaible:true})
    return res.status(200).json(
      new ApiResponse(true,`All availaible node actions fetched sucessfully`,allNodeActions)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,`Failed to fetch all action`)
    )
  }
}