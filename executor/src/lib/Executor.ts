import mongoose, { isObjectIdOrHexString } from "mongoose";
import type { IstartExecutionObject } from "../interfaces";
import { Node, NodeAction, NodeInstance } from "../models/node.model";
import { TriggerInstance } from "../models/trigger.model";
import { Resend } from "resend"

export default class Executor {
    workflowInstanceId: mongoose.Types.ObjectId;
    triggerInstanceId: mongoose.Types.ObjectId;
    triggerActionId: mongoose.Types.ObjectId;
    triggerId: mongoose.Types.ObjectId;
    workflowId: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;

    triggerInstance: any;

    constructor(startExecutionObject: IstartExecutionObject) {
        console.log('startExecutionObject : ', startExecutionObject);

        let {
            workflowInstanceId,
            triggerInstanceId,
            triggerActionId,
            triggerId,
            workflowId,
            owner
        } = startExecutionObject

        this.workflowInstanceId = new mongoose.Types.ObjectId(workflowInstanceId)
        this.triggerInstanceId = new mongoose.Types.ObjectId(triggerInstanceId)
        this.triggerActionId = new mongoose.Types.ObjectId(triggerActionId)
        this.triggerId = new mongoose.Types.ObjectId(triggerId)
        this.workflowId = new mongoose.Types.ObjectId(workflowId)
        this.owner = new mongoose.Types.ObjectId(owner)

        console.log('workflowInstanceId : ', workflowInstanceId);
        console.log('triggerInstanceId : ', triggerInstanceId);
        console.log('triggerActionId : ', triggerActionId);
        console.log('workflowId : ', workflowId);
        console.log('triggerId : ', triggerId);
        console.log('owner : ', owner);

        if (!workflowInstanceId || !triggerActionId || !triggerActionId || !triggerId || !workflowId || !owner) {
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
    async startExecution() {
        try {

            const allSolelyDependentNodes = await Node.aggregate([{
                $match: {
                    workflowId: this.workflowId,
                    prerequisiteNodes: []
                }
            }, {
                $lookup: {
                    from: "nodeactions",
                    foreignField: '_id',
                    localField: "nodeActionId",
                    as: "nodeAction"
                }
            }, {
                $unwind: {
                    path: "$nodeAction"
                }
            }])

            console.log('allSolelyDependentNodes : ', allSolelyDependentNodes);

            for (let i = 0; i < allSolelyDependentNodes.length; i++) {
                const nodeActionName = allSolelyDependentNodes[i].nodeAction.name
                console.log('nodeActionName : ', nodeActionName);

                if (nodeActionName == 'telegram_send_message') {
                    console.log('node instance to be started is : action:telegram_send_message');
                    const inData = await this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ', inData);
                    this.telegram_send_message(allSolelyDependentNodes[i]._id)
                } else if (nodeActionName == 'gmail_send_email') {
                    console.log('node instance to be started is : action:gmail_send_email');

                    const inData = await this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ', inData);
                    this.gmail_send_email(allSolelyDependentNodes[i]._id, inData);
                }
            }

            return true;
        } catch (error) {
            console.log('ERROR : startExecution : ', error);
            return true
        }
    }

    async telegram_send_message(nodeId: string) {
        console.log('Message send using telegram');
        const telegramSendMessageInstance = await NodeInstance.create({
            workflowInstanceId: this.workflowInstanceId,
            nodeId,
            workflowId: this.workflowId,
            inData: {},
            outData: {
                telegram_send_message: 'Message sent sucesfully using telegram node'
            }
        })

        this.handleNextDependingNodeExecution(nodeId)
        return;

        const bot_api = "8287220121:AAHPZ6uFAJB_vUsTW1AukNYFHHkrV_uUBAA"
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

    async inDataProducer(nodeIdStr: string) {
        const nodeId = new mongoose.Types.ObjectId(nodeIdStr)

        try {
            if (!nodeId) return {}

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
                _id: nodeId
            })

            if (!node) return {}

            const triggerId = node.triggerId
            const prerequisiteNodesIds = node.prerequisiteNodes;

            let triggerInstance, preqrequisiteNodesInstances = [];
            const inData = {}


            if (triggerId) {
                triggerInstance = await TriggerInstance.findOne({
                    _id: this.triggerInstanceId
                })
            }

            if (prerequisiteNodesIds && prerequisiteNodesIds.length != 0) {
                preqrequisiteNodesInstances = await NodeInstance.find({
                    workflowInstanceId: this.workflowInstanceId,
                    nodeId: {
                        $in: prerequisiteNodesIds
                    }
                })
            }

            if (triggerInstance) {
                Object.assign(inData, triggerInstance.outData)
            }

            for (let i = 0; i < preqrequisiteNodesInstances.length; i++) {
                Object.assign(inData, preqrequisiteNodesInstances[i]?.outData)
            }

            inData.success = true

            return inData;

        } catch (error) {
            console.log('ERROR : inDataProducer : ', error);
            return {
                success: false
            }
        }
    }

    //send email to someone
    /**
     * 1.fetch the node with given nodeId
     * 2.retrive to,from,html from the node.data 
     * 3.use mustache to place any value in those 3 (to,from,html) using inData object
     * 4.fetch the credential of the user that has resend 
     * 4.call resend function to send email
     * 5.call the handle_next_node_execution
     */
    async gmail_send_email(nodeIdStr: string, inData: any) {
        //creating the inData object with the help of all the prerequisiteNodes and maybe triggerId node that node 
        console.log('inside gmail_send_email');

        try {
            const nodeId = new mongoose.Types.ObjectId(nodeIdStr)
            let node = await Node.aggregate([
                {
                    $match: {
                        _id: nodeId
                    }
                }, {
                    $lookup: {
                        from: "credentials",
                        foreignField: "_id",
                        localField: "credentialId",
                        as: "credential"
                    }
                }, {
                    $unwind: {
                        path: "$credential",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])

            if (!node || node.length == 0) {
                console.log('Cannot find node with given nodeId');
                return;
            }

            node = node[0]

            const { to, from, subject, html } = node.data
            if (!to || !from || !subject || !html) {
                console.log('Received gmail_send_email node has insufficient data');
                return;
            }
            // else if (!node.credentialId) {
            //     console.log('gmail_send_email has no attached credential with it,attach RESEND credential');
            //     return;
            // } else if (!node.credential) {
            //     console.log('Credential not found with given credentialId of this node');
            //     return;
            // }

            // const RESEND_API_KEY = node.credential?.data.RESEND_API_KEY

            //:TODO uncomment the upper credential logic and remove the line below when working with frontend user data

            const RESEND_API_KEY = process.env.RESEND_API_KEY

            if (!RESEND_API_KEY) {
                console.log('RESEND_API_KEY not found for used credential');
                return;
            }

            const email_response = await this.helper_resend_send_email(RESEND_API_KEY, to, from, subject, html)

            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                workflowId: this.workflowId,
                inData,
                outData: {
                    ...email_response
                },
                executeSuccess: true
            })


            this.handleNextDependingNodeExecution(nodeId)


        } catch (error) {
            console.log('ERROR :: gmail_send_email ', error);

        }
    }

    //call the next nodes that depend on ths node with _id:nodeId and all of there other preqrequisiteNodes have instances of this workflow
    /**
     * 1.fetch all the nodes of that workflowId who have this nodeId in the preqrequisiteNodes array
     * 2.for all fetched nodes from db check if all the nodeId they have in prerequisiteNodes do they have instance of it with that workflowInstanceId
     * if those nodes dont have instance then we cant trigger this node action yet
     * 3.if now the node.allPrerequisitesSuccessNeeded is true then we need to also retrive all the instances from the prerequisiteNodesIds and then check if they are a success or not - if any one of it is false then continue
     * 4.if allPrerequisitesSuccessNeeded if false then call the handler of that node action
     */

    async handleNextDependingNodeExecution(nodeIdStr: string) {
        try {
            const nodeId = new mongoose.Types.ObjectId(nodeIdStr)

            const allDependingNodes = await Node.aggregate([
                {
                    $match:{
                        workflowId: this.workflowId,
                        prerequisiteNodes: nodeId
                    }
                },{
                    $lookup:{
                        from:"nodeactions",
                        foreignField:"_id",
                        localField:'nodeActionId',
                        as:"nodeAction"
                    }
                }
            ])

            console.log('allDependingNodes : ', allDependingNodes);
            for (let i = 0; i < allDependingNodes.length; i++) {
                const preqrequisiteNodesIds = allDependingNodes[i].prerequisiteNodes

                const totalInstancesOfPreceedingNodes = await NodeInstance.countDocuments({
                    workflowInstanceId: this.workflowInstanceId,
                    nodeId: {
                        $in: preqrequisiteNodesIds
                    }
                })

                console.log('totalInstancesOfPreceedingNodes : ', totalInstancesOfPreceedingNodes);

                if (totalInstancesOfPreceedingNodes != preqrequisiteNodesIds.length) {
                    console.log('all prerequisites are not yet fullfilled');
                    return;
                } else {
                    console.log('all prerequisite nodes are executed');

                    if (allDependingNodes[i].allPrerequisitesSuccessNeeded) {
                        const totalSuccessfullPreceedingInstances = await NodeInstance.countDocuments({
                            workflowInstanceId: this.workflowInstanceId,
                            nodeId: {
                                $in: preqrequisiteNodesIds
                            },
                            executeSuccess: true
                        })

                        if (totalSuccessfullPreceedingInstances != totalInstancesOfPreceedingNodes) {
                            console.log('all precedding node instances are not successful so execution of this node stops here');
                            return;
                        }

                        const nodeAction = await NodeAction.findOne({
                            _id: allDependingNodes[i]?.nodeActionId
                        })
                        if (!nodeAction) {
                            console.log('Node action not found of the node');
                            return;
                        }

                        this.callRespectiveHandler(allDependingNodes[i]?._id, nodeAction)

                    } else {
                        const nodeAction = await NodeAction.findOne({
                            _id: allDependingNodes[i]?.nodeActionId
                        })

                        if (!nodeAction) {
                            console.log('Node action not found of the node');
                            return;
                        }

                        this.callRespectiveHandler(allDependingNodes[i]?._id, nodeAction)
                    }
                }
            }
        } catch (error) {
            console.log('ERROR :: handleNextDependingNodeExecution : ', error);
        }
    }

    async callRespectiveHandler(nodeIdStr: string | mongoose.Types.ObjectId, nodeAction: any) {
        try {
            if (!nodeAction) {
                console.log('nodeAction not received of that node');
                return;
            }
            const nodeId = new mongoose.Types.ObjectId(nodeIdStr)
            const nodeActionName = nodeAction.name
            if (nodeActionName == 'gmail_send_email') {
                const inData = await this.inDataProducer(nodeId);
                console.log('inData received is : ', inData);
                this.gmail_send_email(nodeId, inData)
            } else if (nodeActionName == 'telegram_send_message') {
                const inData = await this.inDataProducer(nodeId)
                this.telegram_send_message(nodeId, inData)
            }
        } catch (error) {
            console.log('ERROR :: callRespectiveHandler : ', error);

        }
    }

    async helper_resend_send_email(RESEND_API_KEY: string, to: string, from: string, subject: string, html: string) {
        try {
            const resend = new Resend(RESEND_API_KEY);

            const response = await resend.emails.send({
                from,
                to,
                subject,
                html,
            });

            console.log("Email sent successfully:", response);
            return response;
        } catch (error) {
            console.error("ERROR :: helper_resend_send_email:", error);
            throw error;
        }
    }
}