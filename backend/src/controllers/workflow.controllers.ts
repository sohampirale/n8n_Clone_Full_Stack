import type { Request, Response } from "express";

/**
 * Get all workflows of user
 * 1.get user from req.user
 * 2.check if that user exists if not reject
 * 3.if yes then fetch all the workflows where owner : user._id
 * 4.return all the workflows
 */
export async function getAllWorkflowsOfUser(req:Request,res:Response){
  try {
    const user = req.user;


  } catch (error) {
    
  }
}