import type { Request, Response } from "express";
import User from "../models/user.model.js";
import ApiResponse from "../lib/ApiResponse.js";
import Workflow from "../models/workflow.model.js";
import mongoose from "mongoose";
import { Trigger, TriggerAction } from "../models/trigger.model.js";
import { generateSlug } from "../helpers/slug.js";
import { Node, NodeAction } from "../models/node.model.js";
import { Tool, ToolForm } from "../models/tool.model.js";
import { LLM } from "../models/llm.model.js";

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

    const exists = await User.exists({
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
    const { name, requestedTrigger, requestedNodes, requestedTools, requestedLLMS } = workflow
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
    const existingTriggerId = existingWorkflow.trigger;

    if (existingTriggerId) {
      await Trigger.findByIdAndDelete(existingTriggerId)
    }

    await Node.deleteMany({
      workflowId: existingWorkflow._id
    })

    await Tool.deleteMany({
      workflowId: existingWorkflow._id
    })

    await LLM.deleteMany({
      workflowId: existingWorkflow._id
    })

    // if (existingNodes && existingNodes.length != 0) {
    //   await Node.deleteMany({
    //     _id: { $in: existingNodes }
    //   });
    // }

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


    for (let i = 0; i < requestedNodes.length; i++) {
      const nodeAction = await NodeAction.findOne({ _id: new mongoose.Types.ObjectId(requestedNodes[i].nodeActionId) })
      if (!nodeAction) {
        return res.status(404).json(
          new ApiResponse(false, `Invalid nodeActionId,Requested action is not found`)
        )
      } else if (!nodeAction.publicallyAvailaible) {
        return res.status(400).json(
          new ApiResponse(false, `Requested action currently unavailaible try again later`)
        )
      }
    }

    const trigger = await Trigger.create({
      triggerActionId,
      workflowId: existingWorkflow._id,
      data: data ?? {}
    })

    existingWorkflow.trigger = trigger._id
    requestedTrigger.triggerId = trigger._id;

    //creating nodes object
    const createdNodesMap = new Map();

    // createdNodesMap.set(requestedTrigger.identityNo,trigger)

    const noOfNodes = requestedNodes.length;
    // console.log('requestedNodes before : ', requestedNodes);

    for (let i = 0; i < noOfNodes; i++) { //for n time loop
      for (let j = 0; j < noOfNodes; j++) {//for all nodes everytime
        if (requestedNodes[j].nodeId) continue;

        //checking if all the prerequisites of requestedNodes[j] are already created
        let { prerequisiteNodesIdentityNos, nodeActionId, data } = requestedNodes[j]

        if (!prerequisiteNodesIdentityNos) {
          return res.status(400).json(
            new ApiResponse(false, `Invalid data provided,no prerequisite nodes array given for a node`)
          )
        }

        //*

        let allPrerequisiteNodesCreated = true
        const prerequisiteNodesDBIds = []

        let triggerId = null;

        if (prerequisiteNodesIdentityNos.includes(requestedTrigger.identityNo)) {
          triggerId = requestedTrigger.triggerId
          prerequisiteNodesIdentityNos = prerequisiteNodesIdentityNos.filter(
            (id) => id !== requestedTrigger.identityNo
          );
        }
        //going to all the IdentityNos
        for (let k = 0; k < prerequisiteNodesIdentityNos.length; k++) {
          if (!createdNodesMap.has(prerequisiteNodesIdentityNos[k])) {
            allPrerequisiteNodesCreated = false;
            break;
          } else {
            const createdNode = createdNodesMap.get(prerequisiteNodesIdentityNos[k])
            prerequisiteNodesDBIds.push(createdNode._id)
          }
        }

        if (!allPrerequisiteNodesCreated) {
          continue;
        }

        const node = await Node.create({
          nodeActionId,
          workflowId: existingWorkflow._id,
          data: {
            "RESEND_API_KEY": "re_9gvf8cFX_NtwUFx3ErqKrYKebPyYSmH3r",
            "from": "Acme <onboarding@resend.dev>",
            "to": "sohampirale20504@gmail.com",
            "subject": "First email from n8n",
            "html": "Hey there, let's build this amazing project"
          },
          prerequisiteNodes: prerequisiteNodesDBIds,
          triggerId
        })

        requestedNodes[j].nodeId = node._id
        createdNodesMap.set(requestedNodes[j].identityNo, node)
      }
    }

    // console.log('requestedNodes after creating nodes : ', requestedNodes);

    //check if all the nodes are created
    for (let i = 0; i < noOfNodes; i++) {
      if (!requestedNodes[i].nodeId) {
        return res.status(400).json(
          new ApiResponse(false, `Unable to form valid workflow,recheck canvas`)
        )
      }
    }

    //creating Tool objects from requestedTools
    const createdTools = []
    for (let i = 0; i < requestedTools.length; i++) {
      const { aiNodeIdentityNo, toolFormId, data, additionalDescription } = requestedTools[i]

      if (!aiNodeIdentityNo) {
        return res.status(400).json(
          new ApiResponse(false, `Invalid AI node identity no.`)
        )
      }

      if (createdNodesMap.has(aiNodeIdentityNo)) {
        if (!await ToolForm.exists({ _id: toolFormId })) {
          return res.status(404).json(
            new ApiResponse(false, `One requested tool not found in availaible tools`)
          )
        }

        const aiNode = createdNodesMap.get(aiNodeIdentityNo)

        const tool = await Tool.create({
          toolFormId,
          data,
          aiNodeId: aiNode._id,
          owner: userId,
          additionalDescription,
          workflowId: existingWorkflow._id
        })

        console.log('created tool : ', tool);
        createdTools.push(tool._id)
      } else {
        console.log('requested aiNodeIdentityNo not found in the createdNodesMap : ', aiNodeIdentityNo);
        console.log('createdNodesMap : ', createdNodesMap);
      }
    }

    const createdLLMS = []
    for (let i = 0; i < requestedLLMS.length; i++) {
      const { model, aiNodeIdentityNo } = requestedLLMS[i]
      if (!model) {
        return res.status(400).json(
          new ApiResponse(false, `Model name not received for the llm created`)
        )
      } else if (!aiNodeIdentityNo) {
        return res.status(400).json(
          new ApiResponse(false, `Requested llm is not attached with any AI Node`)
        )
      }

      if (!createdNodesMap.has(aiNodeIdentityNo)) {
        return res.status(404).json(
          new ApiResponse(false, `aiNode with given aiNodeIdentityNo not found`)
        )
      }
      const aiNodeObj = createdNodesMap.get(aiNodeIdentityNo)

      const llm = await LLM.create({
        model,
        owner: userId,
        workflowId: existingWorkflow._id,
        aiNodeId: aiNodeObj._id
      })
      createdLLMS.push(llm._id)
    }

    const triggerId = requestedTrigger.triggerId;
    const nodes = []
    for (const [identityNo, node] of createdNodesMap) {
      nodes.push(new mongoose.Types.ObjectId(node._id))
    }

    existingWorkflow.trigger = triggerId
    existingWorkflow.nodes = nodes;
    existingWorkflow.active = true
    existingWorkflow.tools = createdTools
    existingWorkflow.llms = createdLLMS

    await existingWorkflow.save()

    return res.status(200).json(
      new ApiResponse(true, `Workflow updated successfully!`, existingWorkflow)
    )

  } catch (error) {
    console.log('ERROR :: updateWorkflow : ', error);

    return res.status(500).json(
      new ApiResponse(false, `Failed to update the workflow`)
    )
  }

}
