import type { Response,Request } from "express";
import ApiResponse from "../lib/ApiResponse.js";
import { ToolForm } from "../models/tool.model.js";

export async function getAllAvailaibleToolForms(req:Request,res:Response){
    try {
        const allToolForms = await ToolForm.find({
            publicallyAvailaible:true
        })
        return res.status(200).json(
            new ApiResponse(true,`All Tool forms fetched successfully`,allToolForms)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(false,`Failed to fetch all the tool forms`)
        )
    }

}