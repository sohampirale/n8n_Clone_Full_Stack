import type { Request, Response } from "express";
import User from "../models/user.model.js";
import ApiResponse from "../lib/ApiResponse.js";
import Workflow from "../models/workflow.model.js";
import mongoose from "mongoose";
import { Trigger, TriggerAction } from "../models/trigger.model.js";
import { generateSlug } from "../helpers/slug.js";
import { Node } from "../models/node.models.js";

/**
 * Get all workflows of user
 * 1.get user from req.user
 * 2.check if that user exists if not reject
 * 3.if yes then fetch all the workflows where owner : user._id
 * 4.return all the workflows
 */
export async function getAllWorkflowsOfUser(req: Request, res: Response) {
  try {
    const { _id } = req.user;
    const userId = new mongoose.Types.ObjectId(_id)

    const exist = await User.exists({
      _id: userId
    })

    if (!exists) {
      return res.status(404).json(
        new ApiResponse(false, "User no longer exists")
      )
    }

    const workflows = await Workflow.find({
      owner: userId
    })


    return res.status(200).json(
      new ApiResponse(true, "All workflows fetched successfully", workflows)
    )

  } catch (error) {
    console.log('ERROR :: getAllWorkflowsOfUser : ', error);

    return res.status(500).json(
      new ApiResponse(false, "Failed to fetch all workflows")
    )
  }
}


/**  
 * Creating workflow for user
 * 1.retrive user from req.user
 * 2.fetch the user with req.user._id
 * 3.fetch the total no of workflows that user has created
 * 4.create the workflow docuemtn with name workflow_no_(total_workflows+1) use it as the slug as well
 * 5.return the workflow in the response
 */

export async function createWorkflow(req: Request, res: Response) {
  try {
    const userData = req.user;

    const { _id } = userData;
    const userId = new mongoose.Types.ObjectId(_id)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, "User no longer exists")
      )
    }
    const totalCreatedWorkflows = await Workflow.countDocuments({ owner: userId })
    const slug = `workflow_no_${totalCreatedWorkflows + 1}`

    const workflow = await Workflow.create({
      name: slug,
      slug,
      owner: userId
    })

    return res.status(201).json(
      new ApiResponse(true, `Workflow created successfully`, {
        slug
      })
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, `Failed to create the workflow`)
    )
  }
}

/**
 * Update workflow everytime user make any changes to the workflow
 * 1.retirve slug from req.params
 * 2.retrive user form req.user
 * 3.check if user exists
 * 4.fetch the workflow with slug given and req.user._id as owner if not found reject and tuen the existingWorkflow.active=false until then
 * 5.retrive existingNodes existingTrigger from fetch workflow from db(existingWorkflow)
 * 6.retrive workflow obj from req.body if not found reject
 * 7.delete all the existingNode and existingTrigger objects that have been created in the past
 * 8.update existingWorkflow.slug=createSlug(workflow.name) and existingWorkflow.name=workflow.name
 * 9.fetch requestedTrigger and requestedNodes from workflow (req.body)
 * 10.check if triggerAction exists with the give triggerActionId inside requestedTrigger 
 *          if not found reject -trigger action not found, if found but is not publicallyAvailaible then reject - requested trigger action is currently unavailaible 
 * 11.create the trigger obj with await Trigger.create (also add data here) give by frontend 
 * 12.add the trigger key value inside the existingWorkflow 
 * 13.add the trigger._id to the requestedTrigger as triggerId=trigger._id
 * 14.calculate no of requestedNode with requestedNodes.length and start one loop for that many iterations
 * 15.in each interation we will be traversing each node so nested for loop n square TC
 * 16.in each interation check if that obj in requestedNodes has the field nodeId if yes continue;
 * 17.if nodeId does not exists then it needs to be created so retriv the field prerequisiteNodesIdentityNos 
 *        then create one set with those prerequisiteNodesIdentityNos and then traverse throiugh all requestedNode array and also check for requestedTrigger
 *        if that obj has the field nodeId (and triggerId in case of requestedTrigger) then remove that identityNo of that obj from that set and push into an local array called createdObjects
 *        after traversing if the set foud to be empty thatb si size =0 that means all the prerequisite nodes are created sucessfully
 * 18.if set foud to be empty then now create the node, with all the prerequiteNodes array with nodeId from the createdObjects
 * 19.then add that created node in the existingWorkflow.nodes array 
 * 20.add that node._id to the obj from requestedNodes of workflow
 * 21.after the all loops finished add one loop to see if all the objects in requestedNodes have the field nodeId or not f not then reject - nodes have invalid dependancy and make the existingWorkflow active=false
 * 22.if all are created successfully then make existingWorkflow.active=true and do await existingWorkflow.save()
 * 23.return response
 */
//different endpoint for only toggling workflow.active T/F

export async function updateWorkflow(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { workflow } = req.body
    if (!slug) {
      return res.status(400).json(
        new ApiResponse(false, `Invalid request,Slug not provided`)
      )
    } else if (!workflow) {
      return res.status(400).json(
        new ApiResponse(false, `Invalid request,new workflow not provided`)
      )
    }
    const { name, requestedTrigger, requestedNodes } = workflow
    if (!name || !requestedTrigger || !requestedNodes) {
      return res.status(400).json(
        new ApiResponse(false, `Invalid request,improper workflow obj provided`)
      )
    }

    const { _id } = req.user;
    const userId = new mongoose.Types.ObjectId(_id)

    const userExists = await User.exists({ _id: userId })

    if (!userExists) {
      return res.status(404).json(
        new ApiResponse(false, `User does not exist anymore`)
      )
    }

    const existingWorkflow = await Workflow.findOne({
      slug,
      owner: userId
    })

    if (!existingWorkflow) {
      return res.status(404).json(
        new ApiResponse(false, `Workflow not found with given slug`)
      )
    }

    existingWorkflow.active = false;
    await existingWorkflow.save()

    const existingNodes = existingWorkflow.nodes
    const existingTrigger = existingWorkflow.trigger;

    if (existingTrigger) {
      await Trigger.findByIdAndDelete(existingTrigger)
    }

    if (existingNodes && existingNodes.length != 0) {
      await Workflow.deleteMany({
        _id: { $in: existingNodes }
      });
    }

    const newSlug = generateSlug(name)
    existingWorkflow.name = name
    existingWorkflow.slug = newSlug;

    const {
      triggerActionId: receivedTriggerActionId,
      data
    } = requestedTrigger

    //creating trigger object

    if (!receivedTriggerActionId) {
      return res.status(400).json(
        new ApiResponse(false, `Invalid request,Trigger Action Id not provided`)
      )
    }

    const triggerActionId = new mongoose.Types.ObjectId(receivedTriggerActionId)

    const triggerActionDB = await TriggerAction.findById(triggerActionId)

    if (!triggerActionDB) {
      return res.status(404).json(
        new ApiResponse(false, `Trigger action not found with given triggerActionId`)
      )
    } else if (!triggerActionDB.publicallyAvailaible) {
      return res.status(400).json(
        new ApiResponse(false, `Requested trigger action currently unavailaible try again later`)
      )
    }

    const trigger = await Trigger.create({
      triggerActionId,
      workflowId: existingWorkflow._id,
      data: data ?? {}
    })

    existingWorkflow.trigger = trigger
    requestedTrigger.triggerId = trigger._id;

    //creating nodes object
    const createdNodesMap=new Map();

    const noOfNodes = requestedNodes.length;

    for (let i = 0; i < noOfNodes; i++) { //for n time loop
      for (let j = 0; j < noOfNodes; j++) {//for all nodes everytime
        if (requestedNodes[j].nodeId) continue;

        //checking if all the prerequisites of requestedNodes[j] are already created
        const { prerequisiteNodesIdentityNos,nodeActionId:receivedNodeActionId } = requestedNodes[j]
 
        if (!prerequisiteNodesIdentityNos) {
          return res.status(400).json(
            new ApiResponse(false, `Invalid data provided,no prerequisite node found for a node`)
          )
        }

        //*
        if (prerequisiteNodesIdentityNos.includes(requestedTrigger.identityNo)) {
          //doesnt matter because trigger is always created before reaching this point
        }
        let allPrerequisiteNodesCreated = true
        const prerequisiteNodesIdentityNos = []

        //going to all the IdentityNos
        for (let k = 0; k < prerequisiteNodesIdentityNos.length; k++) {
          if (!createdNodesMap.has(prerequisiteNodesIdentityNos[k])) {
            allPrerequisiteNodesCreated = false;
            break;
          } else {
            const createdNode = createdNodesMap.get(prerequisiteNodesIdentityNos[k])
            prerequisiteNodesIdentityNos.push(createdNode._id)
          }
        }

        if (!allPrerequisiteNodesCreated) {
          continue;
        }

        //create this node then
        let triggerId=null;
        if(prerequisiteNodesIdentityNos.includes(requestedTrigger.identityNo)){
          triggerId=requestedTrigger.triggerId
        }



        //*

        // const prerequisiteIdentityNosSet = new Set(prerequisiteNodesIdentityNos)
        // const createdObjects = []
        // let triggerId = null

        // if (prerequisiteIdentityNosSet.has(requestedTrigger.identityNo)) {
        //   prerequisiteIdentityNosSet.remove(requestedTrigger.identityNo)
        //   triggerId = requestedTrigger.triggerId;
        // }

        // for (let k = 0; k < noOfNodes; k++) {
        //   if (requestedNodes[k].nodeId && prerequisiteIdentityNosSet.has(requestedNodes[i].identityNo)) {
        //     prerequisiteIdentityNosSet.delete(requestedNodes[k].identityNo)
        //     createdObjects.push(requestedNodes[k])
        //   }
        // }

        // if(prerequisiteIdentityNosSet.size==0){
        //   //all the prerequisite nodes are created 
        //   const prerequisiteNodesNodeId=createdObjects.map((obj)=>obj.nodeId)

        //   const node = await Node.create({
        //     nodeActionId:requestedNodes[j]
        //   })
      }
    }
  }


  } catch (error) {

}
}