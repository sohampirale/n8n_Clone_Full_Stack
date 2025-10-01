import mongoose, { isObjectIdOrHexString } from "mongoose";
import type { IstartExecutionObject } from "../interfaces";
import { Node, NodeAction, NodeInstance } from "../models/node.model";
import { TriggerInstance } from "../models/trigger.model";
import { Resend } from "resend"
import Mustache from "mustache"
import axios from "axios"

//TODO remove the double db fetching logic from inside every node action handler and inside handleNextDependingNodeExecution
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

    /**
     * 1.retive that node also lookup the nodeAction from db using nodeId
     * 2.cross check if nodeAction.name=='telegram_send_message'
     * 3.retrive credential using the node.credentialId also lookup for credentialForm using credentialFormId and 
     * if credential not found reject - telegram credential not found for this node
     * then cross check if the credential.credentialFormId.name =='telegram' if not reject - incorrect credential attached to this node
     * 4.retrive bot_token from node.credential.data.bot_token if not found reject - bot_token not foud for the attached credential
     * 5.retrive chat_id and text from inData and then check if all of the required fields are given 
     * 6.use Mustache to render it using inData
     * 7.send message using telegram api 
     * 8.create the instance of that node
     * 9.call handleNextDependingNodeExecution
     */

    async telegram_send_message(nodeIdStr: string, inData: any) {
        console.log('inside telegram_send_message');

        try {

            const nodeId = new mongoose.Types.ObjectId(nodeIdStr)

            let node = await Node.aggregate([{
                $match: {
                    _id: nodeId
                }
            }, {
                $lookup: {
                    from: "nodeactions",
                    foreignField: "_id",
                    localField: "nodeActionId",
                    as: "nodeAction"
                }
            }, {
                $unwind: {
                    path: "$nodeAction",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: "credentials",
                    foreignField: "_id",
                    localField: "credentialId",
                    as: "credential",
                    pipeline: [{
                        $lookup: {
                            from: "credentialforms",
                            foreignField: "_id",
                            localField: "credentialFormId",
                            as: "credentialForm"
                        }
                    }, {
                        $unwind: {
                            path: "$credentialForm",
                            preserveNullAndEmptyArrays: true
                        }
                    }]
                }
            }, {
                $unwind: {
                    path: "$credential",
                    preserveNullAndEmptyArrays: true
                }
            }])

            if (!node || node.length == 0) {
                throw new Error('Node not found with given nodeId for telegram_send_message')
            }
            node = node[0]

            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                workflowId: this.workflowId,
                inData,
                outData: {},
                executeSuccess: true,
                error: {}
            })

            if (!node.nodeAction) {
                throw new Error('Node action not found for the requested node')
            } else if (node.nodeAction.name != 'telegram_send_message') {
                throw new Error('Node action of the requested node is not telegram_send_message')
            } else if (!node.nodeAction.publicallyAvailaible) {
                throw new Error('Telegram_send_message node is currently not availaible')
            }
            // else if (!node.credential) {
            //     console.log('Credential not attached for the telegram_send_message node');
            //     throw new Error()
            // } else if (!node.credential.credentialForm) {
            //     console.log('CredentialForm not foud for the credential attached to telegram_send_message');
            //     throw new Error()
            // } else if (node.credential.credentialForm.name != 'telegram') {
            //     console.log('Credential Form of the attached credential is not telegram credential');
            //     throw new Error()
            // }



            // const bot_token = node.credential.data.bot_token

            //:TODO remove the comment from above lines after completino fo frontend and remove the hardcoded line below this
            const bot_token = process.env.TELEGRAM_BOT_TOKEN;

            if (!bot_token) {
                throw new Error('bot_token not foud in the telegram credential attached to telegram_send_message node')
            }

            // let {chat_id,text}=node.data
            //:TODO uncomment line above and remove line below
            let chat_id = '940083925', text = 'Hello sir, this message is sent by n8n_clone using telegram_send_message node'


            if (!chat_id || !text) {
                console.log('chat_id or text not given for telegram_send_message node');
                return;
            }

            chat_id = Mustache.render(chat_id, inData)
            text = Mustache.render(text, inData)

            const url = `https://api.telegram.org/bot${bot_token}/sendMessage`
            const { data: response } = await axios.post(url, {
                chat_id,
                text,
                parse_mode: "HTML"
            })
            console.log('EXECUTED TELEGRAM SEND MESSAGE --------------------------------------');

            console.log('Message sent : ', response);
            Object.assign(nodeInstance.outData, response)
            await nodeInstance.save()
            this.handleNextDependingNodeExecution(nodeId)
        } catch (error) {
            console.log('ERROR :: ', error);

            try {
                const existingNodeInstance = await NodeInstance.findOne({
                    workflowInstanceId: this.workflowInstanceId,
                    nodeId: new mongoose.Types.ObjectId(nodeIdStr)
                })
                if (existingNodeInstance) {
                    existingNodeInstance.executeSuccess = false
                    existingNodeInstance.error = error
                    await existingNodeInstance?.save()
                }
            } catch (error) {

            }
            this.handleNextDependingNodeExecution(nodeIdStr)
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
                        from: "nodeactions",
                        foreignField: "_id",
                        localField: "nodeActionId",
                        as: "nodeAction"
                    }
                }, {
                    $unwind: {
                        path: "$nodeAction",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "credentials",
                        foreignField: "_id",
                        localField: "credentialId",
                        as: "credential",
                        pipeline: [{
                            $lookup: {
                                from: "credentialforms",
                                foreignField: "_id",
                                localField: "credentialFormId",
                                as: "credentialForm"
                            }
                        }, {
                            $unwind: {
                                path: "$credentialForm",
                                preserveNullAndEmptyArrays: true
                            }
                        }]
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

            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                workflowId: this.workflowId,
                inData,
                outData: {},
                executeSuccess: true
            })

            node = node[0]
            if (!node.nodeAction) {
                throw new Error('Node action not found for the requested node')
            } else if (!node.nodeAction.name == 'gmail_send_email') {
                console.log('Node action of the requested node is not gmail_send_email');
                throw new Error()
            } else if (!node.nodeAction.publicallyAvailaible) {
                console.log('gmail_send_email node is currently not availaible');
                throw new Error()
            }
            // else if (!node.credential) {
            //     console.log('Credential not attached for the gmail_send_email node');
            //     throw new Error()
            // } else if (!node.credential.credentialForm) {
            //     console.log('CredentialForm not found for the credential attached to gmail_send_email');
            //     throw new Error()
            // } else if (node.credential.credentialForm.name != 'gmail') {
            //     console.log('Credential Form of the attached credential of gmail_send_email node is not gmail credential');
            //     throw new Error()
            // }

            // let { to, from, subject, html } = node.data
            //:TODO uncommment line above and remove lines below

            let to = 'sohampirale20504@gmail.com'
            let from = "Acme <onboarding@resend.dev>"
            let subject = "This is email from n8n_clone"
            let html = "Hey this is n8n_clone sending you email"

            if (!to || !from || !subject || !html) {
                console.log('Received gmail_send_email node has insufficient data');
                return;
            }

            to = Mustache.render(to, inData)
            from = Mustache.render(from, inData)
            subject = Mustache.render(subject, inData)
            html = Mustache.render(html, inData)

            // const RESEND_API_KEY = node.credential?.data.RESEND_API_KEY

            //:TODO uncomment the upper credential logic and remove the line below when working with frontend user data

            const RESEND_API_KEY = process.env.RESEND_API_KEY

            if (!RESEND_API_KEY) {
                console.log('RESEND_API_KEY not found for used credential');
                return;
            }



            const email_response = await this.helper_resend_send_email(RESEND_API_KEY, to, from, subject, html)

            Object.assign(nodeInstance.outData, email_response);
            await nodeInstance.save()

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
                    $match: {
                        workflowId: this.workflowId,
                        prerequisiteNodes: nodeId
                    }
                }, {
                    $lookup: {
                        from: "nodeactions",
                        foreignField: "_id",
                        localField: 'nodeActionId',
                        as: "nodeAction"
                    }
                }, {
                    $unwind: {
                        path: "$nodeAction",
                        preserveNullAndEmptyArrays: true
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
        const nodeId = new mongoose.Types.ObjectId(nodeIdStr)
        let node = await Node.aggregate([
            {
                $match:{
                    _id:nodeId
                }
            },{
                $lookup:{
                    from:"nodeactions",
                    foreignField:"_id",
                    localField:"nodeActionId",
                    as:"nodeAction"
                }
            },{
                $unwind:{
                    path:"$nodeAction",
                    preserveNullAndEmptyArrays:true
                }
            },{
                $lookup:{
                    from:"credential",
                    foreignField:"_id",
                    localField:"credentialId",
                    as:"credential",
                    pipeline:[
                        {
                            $lookup:{
                                from:"credentialforms",
                                foreignField:"_id",
                                localField:"credentialFormId",
                                as:'credentialForm'
                            }
                        },{
                            $unwind:{
                                path:"$credentialForm",
                                preserveNullAndEmptyArrays:true
                            }
                        }
                    ]
                }
            },{
                $unwind:{
                    path:"$credential",
                    preserveNullAndEmptyArrays:true
                }
            },
        ])

        if(!node || node.length==0){
            console.log('node not found with given nodeIdStr inside callRespectiveHandler,returning...');
            return;
        } 
        node=node[0]

        if(!node.nodeAction){
            console.log('nodeAction not found for the nodeId given in callRespectiveHandler,returning...');
            return;
        }

        const nodeActionName = node.nodeAction?.name

        if(nodeActionName=='gmail_send_email'){
            //checks of gmail_send_email
            const inData=await this.inDataProducer(nodeIdStr)
            this.gmail_send_email(node,data)
        } else if(nodeActionName=='telegram_send_email'){
            const inData=await this.inDataProducer(nodeIdStr)
            this.telegram_send_message(node,inData)
        }

        return;
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

    /** Working of aiNode
     * 1.
     * 
     * 
     */
    async aiNode(nodeIdStr:string|mongoose.Types.ObjectId,inData){
        try {
            
        } catch (error) {
            
        }
    }
}