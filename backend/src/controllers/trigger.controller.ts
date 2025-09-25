import type { Response } from "express";
import { TriggerAction } from "../models/trigger.model.js";
import ApiResponse from "../lib/ApiResponse.js";


export async function getAllAvailaibleTriggerActions(req:Request,res:Response){
 try {
  const allTriggerActions= await TriggerAction.find()

  return res.status(200).json(
    new ApiResponse(true,`All trigger actions fetched sucessfully`,allTriggerActions)
  )
 } catch (error) {
  return res.status(500).json(
    new ApiResponse(false,`Failed to fetch all trigger actions`)
  )
 } 
}