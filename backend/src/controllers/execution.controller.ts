import type { Request, Response } from "express";
import mongoose from "mongoose";
import ApiResponse from "../lib/ApiResponse.js";
import Workflow, { WorkflowInstance } from "../models/workflow.model.js";
import { Trigger, TriggerInstance } from "../models/trigger.model.js";
import { getRedisClient } from "../helpers/redisClient.js";
import User from "../models/user.model.js";
import { createClient, REDISEARCH_LANGUAGE } from "redis";
import { Credential } from "../models/credential.model.js";

/**Start execution workflow through manuall trigger
 * 1.retrive userId from req.user
 * 2.retriver username and slug from params
 * 3.retrive workflow using slug 
 * 4.check if workflow.owner==userId if not reject - you dont have permission to trigger this workflow
 * 5.check if workflow.active == true if not reject - current workflow is not active at the moment
 * 6.retrive triggerActionId from workflow DB object
 * 7.create WorkflowInstance with workflowId and owner
 * 8.create the triggerInstance obj with the workfloInstance._id and other necessary fields
 * 9.update the workflowInstance.triggerInstanceId = triggerInstance._id and do await workflowInstance.save()
 * 10.create an object that we are going to push on the queue trigger:executor that will be brPopped by executor
 * 11.return response
 */
export async function executeManualTrigger(req: Request, res: Response) {
    try {
        const redis = await getRedisClient()
        const { _id } = req.user;
        const userId = new mongoose.Types.ObjectId(_id)
        const { username, slug } = req.params

        const user = await User.findOne({
            username
        })

        console.log('user : ',user);
        
        if (!user) {
            return res.status(404).json(
                new ApiResponse(false, `User not found with given username in query`)
            )
        }

        const workflow = await Workflow.findOne({
            slug,
            owner: user._id
        })

        if (!workflow) {
            return res.status(404).json(
                new ApiResponse(false, `No workflow found with given slug : ${slug}`)
            )
        } else if (!workflow.owner.equals(userId)) {
            return res.status(400).json(
                new ApiResponse(false, `Requested workflow is inactive at the moment, activate it to test it`)
            )
        } else if (!workflow.active) {
            return res.status(400).json(
                new ApiResponse(false, `Requested workflow is inactive at the moment, activate it to test it`)
            )
        }

        const triggerIdStr = workflow.trigger //not triggerActionId
        const triggerId = new mongoose.Types.ObjectId(triggerIdStr)

        if (!triggerId) {
            return res.status(400).json(
                new ApiResponse(false, `Requested trigger doesnt have trigger set`)
            )
        }

        const triggerDocs = await Trigger.aggregate([
            {
                $match: {
                    _id: triggerId
                }
            }, {
                $lookup: {
                    from: "triggeractions",
                    localField: "triggerActionId",
                    foreignField: "_id",
                    as: "triggerAction"
                }
            },
            {
                $unwind: {
                    path: "$triggerAction",

                }
            }
        ])


        if (!triggerDocs || triggerDocs.length == 0) {
            return res.status(404).json(
                new ApiResponse(false, `No trigger object found for this workflow`)
            )
        }

        const trigger = triggerDocs[0]
        if (!trigger.triggerAction) {
            return res.status(404).json(
                new ApiResponse(false, `No trigger action found for triggered action`)
            )
        } else if (trigger.triggerAction?.name != 'trigger:manual_click') {
            return res.status(400).json(
                new ApiResponse(false, `Requested workflow has : ${trigger.triggerAction?.name} as its trigger and not manuall trigger`)
            )
        }

        const workflowInstance = await WorkflowInstance.create({
            workflowId: workflow._id,
            owner: userId
        })

        const triggerInstance = await TriggerInstance.create({
            workflowInstanceId: workflowInstance._id,
            owner: userId,
            triggerId,
            workflowId: workflow._id
        })

        workflowInstance.triggerInstanceId = triggerInstance._id

        await workflowInstance.save()

        const exeuctionStartObject = {
            workflowInstanceId: workflowInstance._id,
            triggerInstanceId: triggerInstance._id,
            triggerId,
            triggerActionId: trigger.triggerAction._id,
            workflowId: workflow._id,
            owner: userId
        }

        await redis.lPush("executor:trigger", JSON.stringify(exeuctionStartObject))
        console.log('executionStartObject pushed onto queue : executor:trigger');

        return res.status(200).json(
            new ApiResponse(true, `Workflow triggered manually & successfully`, exeuctionStartObject)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(false, `Failed to manually trigger workflow`)
        )
    }
}

/** execute the webhook trigger used by a workflow
 * 1.retrive username, slug from params
 * 2.fetch user using username
 * 3.fetch workflow using slug and user._id if workflow not found reject - workflow not found with given username and slug of workflow
 * 4.fetch trigger(use aggregation pipeline on triggerActionId from trigger object) using workflow.trigger if not foud reject - requested workflow does not have any trigger
 * 5.check fi triggerAction exists inside trigger (from mongoose aggregation)
 * 6.check if triggerAction.name == trigger:webhook if not reject - trigger of this workflow is not a webhook
 * 7.check if trigger.data.method == req.method if dont match then reject - invalid method used for this webhook trigger
 * import redis from helper  using =await getRedisClient()
 * 8.create workfloInstance obj with workflowId and owner as user._id
 * 9.create the triggerInstance obj with the inData as req.body(sent by webhook provider)
 * 10.update workflowInstance.triggerInstanceId = triggerInstance._id and await workflowInstance.save()
 * 11.create executionStartObject
 * 12.push onto the queue executor:trigger queue in redis db using redis client
 * 13.return response
*/
export async function executeWebhookTrigger(req: Request, res: Response) {
    try {
        const method = req.method;
        const receivedData = req.body
        const { username, slug } = req.params
        const user = await User.findOne({
            username
        })

        if (!user) {
            return res.status(404).json(
                new ApiResponse(false, `User not found with given username`)
            )
        }

        const workflow = await Workflow.findOne({
            owner: user._id,
            slug
        })

        if (!workflow) {
            return res.status(404).json(
                new ApiResponse(true, `Workflow not found belonging to user : ${username} with workflow slug : ${slug}`)
            )
        } else if (!workflow.trigger) {
            return res.status(400).json(
                new ApiResponse(false, `Trigger is not created yet for the requested workflow,update and save the workflow`)
            )
        }

        const triggerDocs = await Trigger.aggregate([
            {
                $match: {
                    _id: workflow.trigger
                }
            }, {
                $lookup: {
                    from: "triggeractions",
                    foreignField: "_id",
                    localField: "triggerActionId",
                    as: 'triggerAction'
                }
            }, {
                $unwind: {
                    path: "$triggerAction",
                }
            }
        ])

        if(!triggerDocs || triggerDocs.length==0){
            return res.status(404).json(
                new ApiResponse(false,`Trigger not found for the requested workflow`)
            )
        } 

        const trigger = triggerDocs[0]
        const requiredMethod = trigger?.data?.method
        const triggerAction = trigger.triggerAction

        if(!triggerAction){
            return res.status(404).json(
                new ApiResponse(false,`Trigger action not found for the registered trigger obj`)
            )
        } else if(!triggerAction.publicallyAvailaible){
            return res.status(400).json(
                new ApiResponse(false,`Requested trigger action is temporarily disabled consider trying again later or using different trigger action`)
            )
        } else if(triggerAction.name=='trigger:webhook'){
            return res.status(400).json(
                new ApiResponse(false,`Requested workflow does not have webhook as trigger`)
            )
        } else if(method!=requiredMethod){
            return res.status(400).json(
                new ApiResponse(false,`Required http method : ${requiredMethod}, received method : ${method}`)
            )
        }

        const redis = await getRedisClient()

        const workflowInstance= await WorkflowInstance.create({
            workflowId:workflow._id,
            owner:user._id,
        })

        const triggerInstance = await TriggerInstance.create({
            workflowInstanceId:workflowInstance._id,
            triggerId:trigger._id,
            workflowId:workflow._id,
            owner:user._id,
            inData:receivedData // data from webhook provider
        })

        workflowInstance.triggerInstanceId=triggerInstance._id

        await workflowInstance.save()

        const executionStartObject={
            workflowInstanceId:workflowInstance._id,
            triggerInstanceId:triggerInstance._id,
            triggerId:trigger._id,
            triggerActionId:triggerAction._id,
            workflowId:workflow._id,
            owner:user._id
        }

        await redis.lPush("executor:trigger",JSON.stringify(executionStartObject))

        return res.status(200).json(
            new ApiResponse(true, `Workflow triggered successfully using webhook trigger`,executionStartObject)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(false, `Failed to trigger the requested workflow with webhook`)
        )
    }
}

export async function telegramWebhook(req:Request,res:Response){
    try {
        const {username}=req.params;
        console.log('Telegram webhook triggered of username : ',username);
        
        console.log('inside telegram webhook');
        const data = req.body
        if(!data){
            return res.status(400).json({
                message:'No data received'
            })
        } else if(!data.message){
            console.log('message field not found in the receievd data from telegram webhook');
            return res.status(400).json({
                message:'No data received'
            })
        }
        
        const text=data.message.text
        const chat_id=data.message.chat?.id
        const first_name=data.message.chat?.first_name
        const last_name=data.message.chat?.last_name
        
        if(!chat_id){
            console.log('no chat_id found');
            return res.status(400).json({
                message:'No  chat_id found'
            })
        } else if(!text){
            return res.status(400).json({
                message:'No user text found'
            })
        }

        const user = await User.findOne({
            username
        })


        if(!user){
            return res.status(404).json({
                message:'User not found with provided username in params'
            })
        }
        const userId=user._id

        let credential = await Credential.aggregate([
            {
                $match:{
                    owner:user._id
                }
            },{
                $lookup:{
                    from:"credentialforms",
                    foreignField:"_id",
                    localField:"credentialFormId",
                    as:"credentialForm",
                    pipeline:[
                        {
                            $match:{
                                name:'telegram'
                            }
                        }
                    ]
                }
            },{
                $unwind:{
                    path:"$credentialForm"
                }
            }
        ])
        
        console.log('credential ; ',credential);
        if(!credential || credential.length==0){
            console.log('Telegram credential not found for the user with username : ',username);
            return res.status(404).json({
                message:'Telegram credential not found'
            })
        }
        credential=credential[0]

        if(text=='/start'){
            //check if any workflow exists of user user._id which has this telegram_on_message as trigger
            const allTriggers = await Trigger.aggregate([
                {
                    $match:{
                        owner:userId
                    }
                },{
                    $lookup:{
                        from:"triggeractions",
                        foreignField:"_id",
                        localField:"triggerActionId",
                        as:"triggerAction"
                    }
                },{
                    $unwind:{
                        path:"$triggerAction"
                    }
                }
            ])

            console.log('allTriggers : ',allTriggers);
            
        }
        


        // console.log('data received : ',data);
        // data.user=user;
        // const redis = await getRedisClient();
        // await redis.lPush("executor:telegram_webhook",JSON.stringify(data))
        return res.status(200).json({})
    } catch (error) {
        console.log('ERROR : telegramWebhook : ',error);
        
    }
}