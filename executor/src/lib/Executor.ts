import mongoose from "mongoose";
import type { IstartExecutionObject } from "../interfaces";
import { Node, NodeAction, NodeInstance } from "../models/node.model";
import { TriggerInstance } from "../models/trigger.model";

export default class Executor {
    workflowInstanceId: mongoose.Types.ObjectId;
    triggerInstanceId: mongoose.Types.ObjectId;
    triggerActionId: mongoose.Types.ObjectId;
    triggerId: mongoose.Types.ObjectId;
    workflowId: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;

    triggerInstance:any;

    constructor(startExecutionObject:IstartExecutionObject) {
        console.log('startExecutionObject : ',startExecutionObject);
        
        let {
            workflowInstanceId,
            triggerInstanceId,
            triggerActionId,
            triggerId,
            workflowId,
            owner
        } = startExecutionObject

        this.workflowInstanceId=new mongoose.Types.ObjectId(workflowInstanceId)
        this.triggerInstanceId=new mongoose.Types.ObjectId(triggerInstanceId)
        this.triggerActionId=new mongoose.Types.ObjectId(triggerActionId)
        this.triggerId=new mongoose.Types.ObjectId(triggerId)
        this.workflowId=new mongoose.Types.ObjectId(workflowId)
        this.owner=new mongoose.Types.ObjectId(owner)

        console.log('workflowInstanceId : ',workflowInstanceId);
        console.log('triggerInstanceId : ',triggerInstanceId);
        console.log('triggerActionId : ',triggerActionId);
        console.log('workflowId : ',workflowId);
        console.log('triggerId : ',triggerId);
        console.log('owner : ',owner);
        
        if(!workflowInstanceId || !triggerActionId || ! triggerActionId || ! triggerId || !workflowId || !owner){
            console.log('Insufficient data provided for executor');
            throw new Error()
        }
    }

    /** starting the execution of the workflow
     * 1.fetch all nodes that are only depending on the trigger in this workflow using workflowId, triggerId && prerequisiteNodes.length==0
     *  if no nodes found then its an invalid workflow push onto failed-executions
     * 2.fetch nodeAction of each node that is found to be next to execute
     * 3.iterate through all nodeactions check there .name and call appropriate executor for it do - do this in try catch and dont await
     */
    async startExecution(){
        try {

            // const allSolelyDependentNodes=await Node.find({
            //     workflowId:this.workflowId
            // })

            const allSolelyDependentNodes = await Node.aggregate([{
                $match:{
                    workflowId:this.workflowId,
                    prerequisiteNodes:[]
                }
            },{
                $lookup:{
                    from:"nodeactions",
                    foreignField:'_id',
                    localField:"nodeActionId",
                    as:"nodeAction"
                }
            },{
                $unwind:{
                    path:"$nodeAction"
                }
            }])

            console.log('allSolelyDependentNodes : ',allSolelyDependentNodes);
            for(let i=0;i<allSolelyDependentNodes.length;i++){
                const nodeActionName = allSolelyDependentNodes[i].nodeAction.name
                if(nodeActionName=='action:telegram_send_message'){
                    console.log('node instance to be started is : action:telegram_send_message');
                    const inData=this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ',inData);

                } else if(nodeActionName=='action:gmail_send_email'){
                    console.log('node instance to be started is : action:gmail_send_email');
                    
                    const inData = this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ',inData);
                    
                } 
            }

            return true
        } catch (error) {
            console.log('ERROR : startExecution : ',error);
            return true
        }
    }

    
    async telegram_send_message(nodeId:string){
        const bot_api="8287220121:AAHPZ6uFAJB_vUsTW1AukNYFHHkrV_uUBAA"
        try {
            // const chatId = `${}`
        } catch (error) {
            
        }
    }

    /**
     * 1.fetch node with the help of nodeId given
     * 2.fetch the triggerNode if that node had triggerId !=null
     * 3.fetch all the prerequisiteNodes with the help of that field in node obj
     * 4.create one inData object {}
     * 5.spread all the key values in trigger.inData
     * 6.traverse throught all prerequisiteNodes and spread those also into inData object
     * 7.return the inData
     */

    async inDataProducer(nodeIdStr:string){
        const nodeId = new mongoose.Types.ObjectId(nodeIdStr)

        try {
            if(!nodeId)return {}

            // let node = await Node.aggregate([{
            //     $match:{
            //         _id:nodeId
            //     }
            // },{
            //     $lookup:{
            //         from:"nodeinstances",
            //         foreignField:"nodeId",
            //         localField:"prerequisiteNodes",
            //         as:"prerequisiteNodeInstances"
            //     }
            // },{
            //     $match:{
            //         "$prerequisiteNodeInstances.workflowInstanceId":this.workflowInstanceId
            //     }
            // },{
            //     $lookup:{
            //         from:"triggerinstances",
            //         foreignField:"triggerId",
            //         localField:"triggerId",
            //         as:"triggerInstance"
            //     }
            // },{
            //     $unwind:{
            //         path:"$triggerInstance",
            //         preserveNullAndEmptyArrays:true
            //     }
            // }])


            //simple way

            const node = await Node.findOne({
                _id:nodeId
            })

            if(!node)return {}

            const triggerId = node.triggerId
            const prerequisiteNodesIds=node.prerequisiteNodes;

            let triggerInstance,preqrequisiteNodesInstances=[];
            const inData={}
            

            if(triggerId){
                triggerInstance=await TriggerInstance.findOne({
                    _id:this.triggerInstanceId
                })
            }

            if(prerequisiteNodesIds && prerequisiteNodesIds.length!=0){
                preqrequisiteNodesInstances=await NodeInstance.find({
                    workflowInstanceId:this.workflowInstanceId,
                    nodeId:{
                        $in:prerequisiteNodesIds
                    }
                })
            }

            if(triggerInstance){
                Object.assign(inData,triggerInstance.outData)
            }

            for(let i=0;i<preqrequisiteNodesInstances.length;i++){
                Object.assign(inData,preqrequisiteNodesInstances[i]?.outData)
            }

            inData.success=true

            return inData;

        } catch (error) {
            console.log('ERROR : inDataProducer : ',error);
            return {
                success:false
            }
        }
    }

    async gmail_send_email(){
        //creating the inData object with the help of all the prerequisiteNodes and maybe triggerId node that node 
        try {
            
        } catch (error) {
            
        }
    }
}