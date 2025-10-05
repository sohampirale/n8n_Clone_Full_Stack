import mongoose from "mongoose";
import type { IstartExecutionObject } from "../interfaces";
import { Node, NodeInstance } from "../models/node.model";
import { TriggerInstance } from "../models/trigger.model";
import { Resend } from "resend"
import Mustache from "mustache"
import axios, { all } from "axios"
import { LLM } from "../models/llm.model";
import { Tool, ToolInstance } from "../models/tool.model";
import { z } from "zod"

// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { createReactAgentExecutor } from "@langchain/langgraph";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; 

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createToolCallingAgent, AgentExecutor } from "@langchain/core/agents";
import { DynamicTool, tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import type { Node } from "@langchain/core/runnables/graph";
import { Credential } from "../models/credential.model";

const allToolsSchema = {
    fetch_weather: z.object({
        cityName: z.string().describe('cityname whose current weather needs to be fetched')
    }),
    telegram_send_message_and_wait_for_response: z.object({
        text: z.string()
    })
}

export const waitingToolInstances = new Map()

//TODO remove the double db fetching logic from inside every node action handler and inside handleNextDependingNodeExecution
export default class Executor {
    workflowInstanceId: mongoose.Types.ObjectId;
    triggerInstanceId: mongoose.Types.ObjectId;
    triggerActionId: mongoose.Types.ObjectId;
    triggerId: mongoose.Types.ObjectId;
    workflowId: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    toolFunctionMap: Map<string, any>;
    triggerInstance: any;
    waitingToolInstances: Map<string, any>;

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

        if (!workflowInstanceId || !triggerActionId || !triggerActionId || !triggerId || !workflowId || !owner) {
            console.log('Insufficient data provided for executor');
            throw new Error()
        }

        this.workflowInstanceId = new mongoose.Types.ObjectId(workflowInstanceId)
        this.triggerInstanceId = new mongoose.Types.ObjectId(triggerInstanceId)
        this.triggerActionId = new mongoose.Types.ObjectId(triggerActionId)
        this.triggerId = new mongoose.Types.ObjectId(triggerId)
        this.workflowId = new mongoose.Types.ObjectId(workflowId)
        this.owner = new mongoose.Types.ObjectId(owner)
        this.toolFunctionMap = new Map([
            ['fetch_weather', this.fetchWeatherFn],
            ['serpApi', this.serpApiFn],
            ['wikipedia_search', this.wikipediaFn],
            ["telegram_send_message_and_wait_for_response", this.telegram_send_message_and_wait_for_response_toolFN]
        ])
        this.waitingToolInstances=new Map()

        console.log('workflowInstanceId : ', workflowInstanceId);
        console.log('triggerInstanceId : ', triggerInstanceId);
        console.log('triggerActionId : ', triggerActionId);
        console.log('workflowId : ', workflowId);
        console.log('triggerId : ', triggerId);
        console.log('owner : ', owner);
        console.log('toolFunctionMap : ', owner);


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
            }, {
                $lookup: {
                    from: "credentials",
                    foreignField: "_id",
                    localField: "credentialId",
                    as: "credential",
                    pipeline: [
                        {
                            $lookup: {
                                from: "credentialforms",
                                foreignField: "_id",
                                localField: "credentialFormId",
                                as: "credentialForm"
                            }
                        },
                        {
                            $unwind: {
                                path: "$credentialForm",
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]


                }
            },
            {
                $unwind: {
                    path: "$credential",
                    preserveNullAndEmptyArrays: true
                }
            }
            ])

            console.log('allSolelyDependentNodes : ', allSolelyDependentNodes);

            for (let i = 0; i < allSolelyDependentNodes.length; i++) {
                const nodeActionName = allSolelyDependentNodes[i].nodeAction.name
                console.log('nodeActionName : ', nodeActionName);

                if (nodeActionName == 'telegram_send_message') {
                    console.log('node instance to be started is : action:telegram_send_message');
                    const node= allSolelyDependentNodes[i]
                    console.log('node.credential.credentialForm : ',node.credential.credentialForm);
                    
                     if(!node.credential){
                        console.log('Credential not foud for the telegram_send_message_and_wait_for_response node');
                        continue;
                    } else if(!node.credential.credentialForm){
                        console.log('Credential Form not foud for the telegram_send_message_and_wait_for_response node');
                        continue;
                    } else if(node.credential.credentialForm.name!='telegram'){
                        console.log('Incorrect credential attached to the telegram_send_message_and_wait_for_response node');
                        continue;
                    } else if(!node.credential.data.bot_token){
                        console.log('bot_token not found in the telegram credential attached to the  the telegram_send_message_and_wait_for_response node');
                        continue;
                    }

                    const inData = await this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ', inData);
                    this.telegram_send_message(allSolelyDependentNodes[i],inData)
                } else if (nodeActionName == 'gmail_send_email') {
                    //TODOD add all checks for only gmail_send_email here
                    console.log('node instance to be started is : action:gmail_send_email');
                    const inData = await this.inDataProducer(allSolelyDependentNodes[i]._id)
                    console.log('inData received : ', inData);
                    this.gmail_send_email(allSolelyDependentNodes[i], inData);
                } else if (nodeActionName == 'telegram_send_message_and_wait_for_response') {
                    //all checks that are personal to the telegram_send_message_and_wait_for_response
                    const node = allSolelyDependentNodes[i]
                    // if(!node.credential){
                    //     console.log('Credential not foud for the telegram_send_message_and_wait_for_response node');
                    //     continue;
                    // } else if(!node.credential.credentialForm){
                    //     console.log('Credential Form not foud for the telegram_send_message_and_wait_for_response node');
                    //     continue;
                    // } else if(node.credential.credentialForm.name!='telegram'){
                    //     console.log('Incorrect credential attached to the telegram_send_message_and_wait_for_response node');
                    //     continue;
                    // } else if(!node.credential.data.bot_token){
                    //     console.log('bot_token not found in the telegram credential attached to the  the telegram_send_message_and_wait_for_response node');
                    //     continue;
                    // }

                    console.log('node handler to be started is : telegram_send_message_and_wait_for_response');
                    const inData = await this.inDataProducer(node._id)
                    this.start_telegram_send_message_and_wait_for_response(node, inData)
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

    async telegram_send_message(node: any, inData: any) {
        console.log('inside telegram_send_message node : ',node);

        try {

            const nodeId = new mongoose.Types.ObjectId(node?._id)


            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                owner: this.owner,
                workflowId: this.workflowId,
                inData,
                outData: {},
                executeSuccess: true,
                error: {}
            })


            // const bot_token = node.credential.data.bot_token

            //:TODO remove the comment from above lines after completino fo frontend and remove the hardcoded line below this
            const bot_token = process.env.TELEGRAM_BOT_TOKEN;

            if (!bot_token) {
                throw new Error('bot_token not foud in the telegram credential attached to telegram_send_message node')
            }

            let {chat_id,text}=node.data
            //:TODO uncomment line above and remove line below
            // let chat_id = '940083925', text = 'Hello sir, this message is sent by n8n_clone using telegram_send_message node'


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
            this.handleNextDependingNodeExecution(node._id)
        }
    }

    async start_telegram_send_message_and_wait_for_response(node: any, inData: any) {
        try {

            // const nodeId = new mongoose.Types.ObjectId(nodeIdStr)

            // let node = await Node.aggregate([{
            //     $match: {
            //         _id: nodeId
            //     }
            // }, {
            //     $lookup: {
            //         from: "nodeactions",
            //         foreignField: "_id",
            //         localField: "nodeActionId",
            //         as: "nodeAction"
            //     }
            // }, {
            //     $unwind: {
            //         path: "$nodeAction",
            //         preserveNullAndEmptyArrays: true
            //     }
            // }, {
            //     $lookup: {
            //         from: "credentials",
            //         foreignField: "_id",
            //         localField: "credentialId",
            //         as: "credential",
            //         pipeline: [{
            //             $lookup: {
            //                 from: "credentialforms",
            //                 foreignField: "_id",
            //                 localField: "credentialFormId",
            //                 as: "credentialForm"
            //             }
            //         }, {
            //             $unwind: {
            //                 path: "$credentialForm",
            //                 preserveNullAndEmptyArrays: true
            //             }
            //         }]
            //     }
            // }, {
            //     $unwind: {
            //         path: "$credential",
            //         preserveNullAndEmptyArrays: true
            //     }
            // }])

            // if (!node || node.length == 0) {
            //     throw new Error('Node not found with given nodeId for telegram_send_message')
            // }
            // node = node[0]

            // const bot_token = node.credential.data.bot_token

            //:TODO remove the comment from above lines after completino fo frontend and remove the hardcoded line below this
            const bot_token = process.env.TELEGRAM_BOT_TOKEN;

            const nodeId = node._id

            if (!bot_token) {
                throw new Error('bot_token not foud in the telegram credential attached to telegram_send_message node')
            }

            // let {chat_id,text}=node.data
            //:TODO uncomment line above and remove line below
            let chat_id = '940083925',
                text = 'This message is send by start_telegram_send_message_and_wait_for_response'


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

            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                owner: this.owner,
                workflowId: this.workflowId,
                inData,
                outData: {
                    sentMessage: text
                },
                executeSuccess: true,
                error: {},
                waiting: true,
                waitingIdentifier: chat_id
            })

            console.log('nodeInstance created : ', nodeInstance);

            Object.assign(nodeInstance.outData, response)
            console.log('stopping start_telegram_send_message_and_wait_for_response');
            //abort here and resume_telegram_send_message_and_wait_for_response
        } catch (error) {
            console.log('ERROR :: start_telegram_send_message_and_wait_for_response : ', error);
        }
    }

    async resume_telegram_send_message_and_wait_for_response(nodeInstanceIdStr: mongoose.Schema.Types.ObjectId, telegramWebhookData) {
        try {

            const nodeInstanceId = new mongoose.Types.ObjectId(nodeInstanceIdStr)
            const nodeInstance = await NodeInstance.findOne({
                _id: nodeInstanceId
            })

            if (!nodeInstance) {
                console.log('nodeInstance not found with given nodeInstanceId');
                return;
            } else if (!nodeInstance.waiting) {
                console.log('Requested nodeInstance is not in waiting state nodeInstance : ', nodeInstance);
                return;
            }

            const text = telegramWebhookData?.message?.text;
            if (!text) {
                console.log('Text not found in resume_telegram_send_message_and_wait_for_response handler');
                return;
            }
            console.log('Text received from user : ', text);
            console.log('old outData : ', nodeInstance.outData);

            nodeInstance.outData.receivedMessage = text
            nodeInstance.waiting = false;
            nodeInstance.waitingIdentifier = ""
            console.log('updated outData : ', nodeInstance.outData);


            await nodeInstance.save()
            this.handleNextDependingNodeExecution(nodeInstanceId)
        } catch (error) {
            console.log('ERROR :: resume_telegram_send_message_and_wait_for_response : ', error);
            this.handleNextDependingNodeExecution(nodeInstanceId)
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
    async gmail_send_email(node: any, inData: any) {
        console.log('inside gmail_send_email');

        try {
            const nodeId = node._id

            const nodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId,
                owner: this.owner,
                workflowId: this.workflowId,
                inData,
                outData: {},
                executeSuccess: true
            })

            let { to, from, subject, html } = node.data
            //:TODO uncommment line above and remove lines below

            // let to = 'sohampirale20504@gmail.com'
            // let from = "Acme <onboarding@resend.dev>"
            // let subject = "This is email from n8n_clone"
            // let html = "Hey this is n8n_clone sending you email"

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

                        this.callRespectiveHandler(allDependingNodes[i]?._id)

                    } else {

                        this.callRespectiveHandler(allDependingNodes[i]?._id)
                    }
                }
            }
        } catch (error) {
            console.log('ERROR :: handleNextDependingNodeExecution : ', error);
        }
    }

    async callRespectiveHandler(nodeIdStr: string | mongoose.Types.ObjectId) {
        console.log('inside callRespectiveHandler');

        let inData;
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
                        from: "credential",
                        foreignField: "_id",
                        localField: "credentialId",
                        as: "credential",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "credentialforms",
                                    foreignField: "_id",
                                    localField: "credentialFormId",
                                    as: 'credentialForm'
                                }
                            }, {
                                $unwind: {
                                    path: "$credentialForm",
                                    preserveNullAndEmptyArrays: true
                                }
                            }
                        ]
                    }
                }, {
                    $unwind: {
                        path: "$credential",
                        preserveNullAndEmptyArrays: true
                    }
                },
            ])

            if (!node || node.length == 0) {
                console.log('node not found with given nodeIdStr inside callRespectiveHandler,returning...');
                return;
            }
            node = node[0]

            if (!node.nodeAction) {
                console.log('nodeAction not found for the nodeId given in callRespectiveHandler,returning...');
                return;
            }

            const nodeActionName = node.nodeAction?.name
            inData = await this.inDataProducer(nodeId)

            //:TODO uncomment few checks in each handler selection that are commented out until frontend is made
            console.log('nodeActionName : ', nodeActionName);

            if (nodeActionName == 'gmail_send_email') {
                //checks of gmail_send_email
                if (!node.nodeAction.publicallyAvailaible) {
                    throw new Error('gmail_send_email node is currently not availaible');
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

                //:TODO(optional maybe) can also check for the {to,from,html,subject} are given in the node.data here
                this.gmail_send_email(node, inData)
            } else if (nodeActionName == 'telegram_send_message') {
                if (!node.nodeAction.publicallyAvailaible) {
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

                this.telegram_send_message(node, inData)
            } else if (nodeActionName == 'aiNode') {
                if (!node.nodeAction.publicallyAvailaible) {
                    throw new Error('aiNode action currently unavailaible');

                }
                // else if (!node.data?.userQuery) {
                //     throw new Error('userQuery not found for the aiNode created');
                // }
                //:TODO uncomment this after completing frontend and simple BE logic 

                let attachedLLM = await LLM.aggregate([
                    {
                        $match: {
                            workflowId: this.workflowId,
                            aiNodeId: node._id
                        }
                    }, {
                        $lookup: {
                            from: "credentials",
                            foreignField: "_id",
                            localField: "credentialId",
                            as: "credential",
                            pipeline: [
                                {
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
                                }
                            ]
                        }
                    }, {
                        $unwind: {
                            path: "$credential",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ])

                if (!attachedLLM || attachedLLM.length == 0) {
                    throw new Error('No attached llm foud for the AI Node');

                }

                attachedLLM = attachedLLM[0]

                //:TODO uncomment this after completing frontend and simple BE logic 
                // if (!attachedLLM.credential) {
                //     throw new Error('No credential found for the attached llm');

                // } else if (!attachedLLM.credential.credentialForm) {
                //     throw new Error('No credential form found for the attached credential to llm');

                // } else if (attachedLLM.credential.credentialForm.type != 'llm') {
                //     throw new Error('Credential attached to the LLM is not of LLM type,incorrect credential chosen');
                // }

                node.llm = attachedLLM;
                //Leaving the check of API_KEY or whatever requiredField that is needed for the credentialForm to be checked at aiNodeHandler

                const attachedTools = await Tool.aggregate([{
                    $match: {
                        workflowId: this.workflowId,
                        aiNodeId: node._id
                    }
                }, {
                    $lookup: {
                        from: "toolforms",
                        foreignField: "_id",
                        localField: "toolFormId",
                        as: "toolForm"
                    }
                }, {
                    $unwind: {
                        path: "$toolForm",
                        preserveNullAndEmptyArrays: true
                    }
                }
                ])

                if (!attachedTools || attachedTools.length == 0) {
                    console.log('No attached tools found for aiNode, allowing it for this moment');
                }

                //in this we can iterate through each attachedTool.toolForm and it does not exist - throw requested tool does not have toolForm associated with it 
                node.tools = attachedTools
                this.aiNode(node, inData)
                return;
            } else {
                console.log('node valid nodeActionName found : ', nodeActionName);
            }

            return;
        } catch (error) {
            console.log('ERROR : callRespectiveHandler : ', error);

            try {
                const nodeInstance = await NodeInstance.create({
                    workflowInstanceId: this.workflowInstanceId,
                    nodeId: new mongoose.Types.ObjectId(nodeIdStr),
                    workflowId: this.workflowId,
                    owner: this.owner,
                    inData: inData ?? {},
                    outData: {},
                    executeSuccess: false,
                    error: {}
                })

            } catch (error) {

            }
            this.handleNextDependingNodeExecution(nodeIdStr)
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
     * since all checks are done we can just work with the node 90%
     * 1.retrive {userQuery} from node.data and render it using Mustache using inData
     * 2.find api key node.credential.credentialForm.name and based on the llm user has selected retrive the API_KEY 
     * 3.if api key not foud - throw api key not found for the attached credential
     * 4.create the required llm using the api key
     * Creating tools 
     * 5.iterate through all node.tools and based on tools[i].toolForm.name fetch the funciton from toolFunctionMap 
     *  if function not found from toolFunctionMap fetch it from user defined tools - future feature not yet created
     * 6.create the tool from each retrive function from toolFunctionMap that will be used to give to llm
     * 7.await invoke the LLM
     * 8.create the instance with outData and inData as well
     */

    async aiNode(node: any, inData: any) {
        console.log('inside aiNode handler');

        try {
            const credentialFormName = node.llm?.credential?.credentialForm?.name
            const model = node.llm?.data?.model
            let llm;

            if (credentialFormName == 'gemini') {

                llm = new ChatGoogleGenerativeAI({
                    model: model ?? "gemini-2.0",
                    apiKey: node.llm.credential.data.API_KEY,
                    temperature: 0.7
                });
            }

            //TODO remove this global llm creator after frontend completed
            llm = new ChatGoogleGenerativeAI({
                model: "gemini-2.0-flash",
                apiKey: process.env.GOOGLE_API_KEY,
                temperature: 1
            });


            const aiNodeInstance = await NodeInstance.create({
                workflowInstanceId: this.workflowInstanceId,
                nodeId: node._id,
                owner: this.owner,
                workflowId: this.workflowId,
                inData,
                outData: {
                    ...inData,
                }
            })

            //TODO uncomment this after completing frontend
            // let {chat_id}=node.data

            // if(chat_id){
            //     chat_id=Mustache.render(chat_id,inData)
            // }

            const initialState = {
                workflowInstanceId: this.workflowInstanceId,
                triggerInstanceId: this.triggerInstanceId,
                triggerActionId: this.triggerActionId,
                triggerId: this.triggerId,
                workflowId: this.workflowId,
                owner: this.owner,
                triggerInstance: this.triggerInstance,
                aiNodeInstanceId: aiNodeInstance._id
            };


            const agentTools: any = [];

            const tools = node.tools;
            for (let i = 0; i < tools.length; i++) {
                const toolFormName = tools[i]?.toolForm?.name
                console.log('toolFormName : ', toolFormName);
                if (this.toolFunctionMap.has(toolFormName)) {

                    initialState[toolFormName] = {
                        toolId: tools[i]._id
                    }

                    if (toolFormName == 'telegram_send_message_and_wait_for_response') {
                        initialState[toolFormName].chat_id = "940083925"
                        //TODO uncomment after completing frontend
                        // let {chat_id}=node.data;
                        // if(chat_id){
                        //     chat_id=Mustache.render(chat_id,inData)
                        //     initialState[toolFormName].chat_id=chat_id
                        // }
                    }

                    const toolFn = this.toolFunctionMap.get(toolFormName)
                    console.log('description : ', tools[i].toolForm.description);
                    const tool = new DynamicTool({
                        name: toolFormName,
                        description: tools[i]?.toolForm?.description,
                        func: async (input) => {
                            return await toolFn(input, initialState)
                        },
                        schema: allToolsSchema[toolFormName]
                    })
                    console.log('created tool with DynamicTool : ');

                    agentTools.push(tool)
                }
            }

            // const systemPrompt = `You are a helpful assistent and part of the AI workflow management software 
            // who uses tools given to him to respond when needed to users when possible as well as uses your own tools when needed(sending telegram messages and waiting for response)
            // ,
            // `;

            // const systemPrompt = `You are a helpful assistent and part of the AI workflow management software 
            // who uses tools given to him to respond when needed to users when possible as well as uses your own tools when needed(sending telegram messages and waiting for response)
            // ,use telegram tool to keep talking with the client and gather information about them such s i.name ii.age iii.city in which they live in frinedly tone, but do not STOP using this tool until we have received all 3 required field name age cityName 
            // `;

//             const systemPrompt = `# AI Workflow Assistant - System Instructions

// ## Core Identity
// You are an intelligent workflow assistant integrated into an AI workflow management platform. Your primary mission is to gather complete user information through natural, friendly conversation via Telegram.

// ## Required Information Collection
// You MUST collect these three fields before concluding the conversation:
// 1. **name** - User's full name
// 2. **age** - User's age (numeric value)
// 3. **cityName** - City where the user currently lives

// ### Collection Status Tracking
// - Keep mental track of which fields you have successfully collected
// - DO NOT mark a field as collected until you receive a clear, valid response
// - If a response is ambiguous or incomplete, ask for clarification

// ## Tool Usage Guidelines
// Before stopping the use of tools and ending the chat ask tehm if they need any help and keep helping and talkign back to them until they are satisfied

// ### Primary Tool: Telegram Communication
// - Use the Telegram tool as your PRIMARY communication channel
// - Each message should feel natural and conversational, never robotic
// - Continue using the tool in a loop until ALL three required fields are collected
// - Never assume information - always wait for explicit user responses

// ### Secondary Tools
// - Use any additional tools at your disposal when they enhance the user experience
// - Examples: data validation, city verification, age range checking
// - Tools should support, not replace, the main conversation flow

// ## Conversation Flow Strategy

// ### Opening (If no data collected)
// - Greet warmly and introduce yourself
// - Explain briefly that you'd like to get to know them better
// - Ask for the first piece of information naturally

// Example: "Hi there! 👋 I'm your AI assistant. I'd love to get to know you better so I can help you more effectively. What's your name?"

// ### Middle (Partial data collected)
// - Acknowledge each response positively
// - Smoothly transition to the next missing field
// - Use the information already collected to personalize questions

// Example: "Nice to meet you, Sarah! And how old are you?"

// ### Handling Edge Cases
// - **Unclear responses**: Politely ask for clarification
//   - "I want to make sure I got that right. Could you confirm your age for me?"
// - **Missing information**: Explicitly state what you still need
//   - "Great! I have your name and age. Just need to know - which city do you live in?"
// - **Resistance**: Be respectful but persistent
//   - "I understand privacy is important. This information helps me provide better assistance. Your city name would be really helpful!"

// ### Closing (All data collected)
// - Confirm all collected information
// - Thank the user warmly
// - Indicate successful completion

// Example: "Perfect! Let me confirm: Your name is John, you're 28 years old, and you live in Mumbai. Is that correct? Thank you so much for sharing this with me!"

// ## Critical Rules

// ### MUST DO:
// ✓ Use Telegram tool for EVERY user interaction
// ✓ Maintain a friendly, conversational tone throughout
// ✓ Validate each piece of information before marking as collected
// ✓ Continue the conversation loop until all 3 fields are complete
// ✓ Handle errors gracefully and retry if tool calls fail
// ✓ Be patient with users who provide incomplete information

// ### MUST NOT DO:
// ✗ Stop the conversation before collecting all 3 required fields
// ✗ Assume or infer information that wasn't explicitly provided
// ✗ Use aggressive or pushy language
// ✗ Move to the next field before confirming the current one
// ✗ Accept invalid data (e.g., non-numeric age, obviously fake names)
// ✗ Make the user feel interrogated - keep it conversational

// ## Data Validation Guidelines

// ### Name
// - Should contain at least first name
// - Can include full name (first + last)
// - Reject single letters or obviously invalid entries
// - Accept various cultural name formats

// ### Age
// - Must be a numeric value
// - Reasonable range: 13-120 years
// - If unrealistic, politely ask for confirmation
// - Accept age ranges only if user is uncomfortable with exact age

// ### City Name
// - Should be a recognizable city name
// - Accept various spellings and languages
// - If ambiguous (e.g., "Paris" - France or Texas?), ask for country
// - Don't require country unless clarification is needed

// ## Tone & Personality
// - **Friendly**: Use warm, welcoming language
// - **Professional**: Maintain respect and boundaries
// - **Patient**: Don't rush the user
// - **Adaptive**: Match the user's communication style (formal/casual)
// - **Encouraging**: Use positive reinforcement ("Great!", "Perfect!", "Thanks!")
// - **Human-like**: Use natural conversation patterns, occasional emojis (sparingly)

// ## State Management
// Internally track your progress:
// - [ ] name_collected: false
// - [ ] age_collected: false  
// - [ ] city_collected: false

// Only mark a field as true when you have valid, confirmed data.

// ## Error Recovery
// If a tool call fails:
// 1. Acknowledge the issue transparently
// 2. Retry the operation
// 3. If repeated failures, explain the situation politely
// 4. Continue attempting to collect information

// ## Completion Criteria
// The conversation is complete ONLY when:
// 1. All three fields (name, age, cityName) are collected
// 2. Each field contains valid data
// 3. User has confirmed the information (optional but recommended)

// Remember: Your success is measured by complete, accurate data collection while maintaining a positive user experience. Be thorough, be friendly, and be persistent!`;

            let systemQuery=`You are AI assistant and master AI Agent used in the AI powered workflow management system who is Really great in using tools provided to him as well using your own intelligence when needed, you do hold risk taking capabilities as well,`
            systemQuery+=node.data?.systemQuery
            const userQuery=node.data?.userQuery
            console.log('final systemQuery : ',systemQuery);
            console.log('final userQuery : ',userQuery);

            

            // const systemPrompt = `You are a helpful assistent and part of the AI workflow management software, the sole purpose you have is using the telegram tool to send message and wait for response and collect information from the user via telegram "tool"!! KEEP TALKING with the user until you recived their 
            // i.Name
            // ii.age
            // iii.city in which they live
            // You have a very friendly tone and authentic helper
            // ` 

            // const { userQuery } = node.data
            // const userQuery = `what is current weather of Mumbai ?`
            // const userQuery = `search for 100xDevs on the wikipedia and return what you get and use tools given to you`
            // const userQuery = `What is meaning of Software developement `
            // const userQuery = `I am curious about what exactly is AI and hwo it works`
            // const userQuery = `Can you tell me currentl weather of Mumbai and SanFranisco `
            // const userQuery = `I want to know about what is 100xSchool in India,fetch from inteernet if you dont know`
            // const userQuery = `what is 2 +2`
            // const userQuery = 'tell the owner on telegram that product delivered is very great! and wait for his response as well'
            // const userQuery = 'Heyy! ai node'

            const agent = createReactAgent({
                llm,
                tools: agentTools,
                messageModifier: systemQuery,  // Adds system prompt to messages
            });

            const result = await agent.invoke(
                { messages: [{ role: "user", content: userQuery }] },
                { configurable: { state: initialState } }
            );

            console.log('result : ');
            console.log(result);

            const llmRespponse = result.messages[result.messages.length - 1].content;
            console.log("Final LLM Response:", llmRespponse);

            //TODO : uncomment these lines below when frontend completed and remove the hardcoded jsonSchema

            // if (node.jsonRequired) {
            //     //in aiNode user requires certain form of json
            //     const { jsonSchema } = node.data
            //     if (jsonSchema) {
            const jsonSchema = {
                "technicalQuestion": "Boolean (Weather question from user was technical or not)",
                "likes": "Array of strings (Guess all the topics the user might be interested in based on the whole conversation)"
            }

            const parsedJson = await this.helper_jsonParser(result, jsonSchema, llm, userQuery)
            
            // } else {
            // console.log('jsonRequired selected for aiNode but jsonSchema not defined');
            // }
            // }

            aiNodeInstance.outData.llmRespponse = llmRespponse
            Object.assign(aiNodeInstance.outData, parsedJson)
            await aiNodeInstance.save()

            this.handleNextDependingNodeExecution(node._id)
        } catch (error) {
            console.log('ERROR : aiNode : ', error);

            this.handleNextDependingNodeExecution(node._id)
        }
    }

    async helper_jsonParser(aiAgentResult: any, jsonSchema: any, llm: any, userQuery: string) {
        try {

            const extractionPrompt = `
                You are a JSON extractor. 
                Given the user query, final LLM response, and tool call metadata, 
                produce ONLY valid JSON with this schema:
        
                ${JSON.stringify(jsonSchema)}
                Return ONLY JSON IN STRINGIFIED FORMAT THAT I CAN JSON.parse on it, no explanation.
                `;

            const extractionResult = await llm.invoke([
                { role: "system", content: extractionPrompt },
                {
                    role: "user", content: JSON.stringify(
                        {
                            userQuery,
                            aiAgentResult,
                        },
                        null,
                        2
                    ),
                },
            ])
            console.log('extractionResult : ', extractionResult);

            const rawContent = extractionResult.content;
            const cleaned = rawContent.replace(/```json|```/g, "").trim();

            const llmExtractionResponse = cleaned
            console.log('llmExtratcionResponse : ', llmExtractionResponse);
            const parsedJson = JSON.parse(llmExtractionResponse);
            console.log('parsedJson : ', parsedJson);
            return parsedJson
        } catch (error) {
            console.log('ERROR : helper_jsonParser : ', error);
            return {}
        }
    }

    //adding all the tool functions that are needed in toolFunctionMap
    async fetchWeatherFn(input: any, state: any) {
        try {

            console.log('inside fetchWeatherFn');
            console.log('input : ', input);
            console.log('state : ', state);
            console.log('someLocalVariable : ', someLocalVariable);

            const weather = (24 + (Math.random() * 10));
            // const toolInstance = await ToolInstance.create({
            //     workflowInstanceId: this.workflowInstanceId,
            //     toolId: new mongoose.Types.ObjectId("68d7cefcaae905ddddf38e97"),
            //     workflowId: this.workflowId,
            //     aiNodeInstanceId:"32323bjhbhkuvbb12311",
            //     inData: {
            //         cityName: input
            //     },
            //     outData: {
            //         weather
            //     },
            //     executeSuccess: true,
            //     error: {},
            //     waiting: false,
            //     waitingIdentifier: null
            // })
            return weather
        } catch (error) {
            console.log('ERROR :: fetchWeatherFn : ', error);

        }
    }

    async serpApiFn(query: string) {
        const serpApiResponse = {
            message: `data fetched by serpApi for query : ${query},it is a school created by harkirat singh sir for enginnering students`
        }

        const toolInstance = await ToolInstance.create({
            workflowInstanceId: this.workflowInstanceId,
            toolId: new mongoose.Types.ObjectId("68d7cefcaae905ddddf38e95"),
            workflowId: this.workflowId,
            inData: {
                query
            },
            outData: {
                serpApiResponse
            },
            executeSuccess: true,
            error: {},
            waiting: false,
            waitingIdentifier: null
        })

        return serpApiResponse
    }

    async wikipediaFn(topicName: string) {
        const wikipediaResponse = `data from wikipedia about topic ${topicName},it is a school for enginnering students satrted by great developer`

        const toolInstance = await ToolInstance.create({
            workflowInstanceId: this.workflowInstanceId,
            toolId: new mongoose.Types.ObjectId("68d7cefcaae905ddddf38e96"),
            workflowId: this.workflowId,
            inData: {
                topicName
            },
            outData: {
                wikipediaResponse
            },
            executeSuccess: true,
            error: {},
            waiting: false,
            waitingIdentifier: null
        })
        return wikipediaResponse
    }

    async telegram_send_message_and_wait_for_response_toolFN(text: string, state: any) {
        try {
            // toolInstanceId: string, bot_token: string, chat_id: string, text: string
            // const toolInstance = await ToolInstance.findById(new mongoose.Types.ObjectId(toolInstanceId))
            // if (!toolInstance) {
            // return "invalid toolInstanceId provided in first argument"
            // }
            console.log('-----------------INSIDE telegram_send_message_and_wait_for_response_toolFN');
            console.log('state : ', state);
            console.log('text : ', text);

            const {
                workflowInstanceId,
                triggerInstanceId,
                triggerActionId,
                triggerId,
                workflowId,
                owner,
                triggerInstance,
                aiNodeInstanceId
            } = state


            const chat_id = state?.telegram_send_message_and_wait_for_response?.chat_id
            const toolId = state?.telegram_send_message_and_wait_for_response?.toolId
            console.log('chat_id', chat_id);

            const toolInstance = await ToolInstance.create({
                workflowInstanceId,
                toolId,
                workflowId,
                aiNodeInstanceId,
                owner,
                inData: {
                    sentMessage: text
                },
                outData: {
                },
                executeSuccess: true,
                error: {},
                waiting: true,
                waitingIdentifier: chat_id
            })
            console.log('toolInstance created : ', toolInstance);


            //fetch the telegram credential with the help of this.owner and then retrive bot_token from it

            let credential = await Credential.aggregate([
                {
                    $match: {
                        owner
                    }
                }, {
                    $lookup: {
                        from: "credentialforms",
                        foreignField: "_id",
                        localField: "credentialFormId",
                        as: "credentialForm"
                    }
                }, {
                    $unwind: {
                        path: "$credentialForm"
                    }
                }, {
                    $match: {
                        "credentialForm.name": "telegram"
                    }
                }
            ])

            //TODO uncomment these after integrating frontend

            // if (!credential || credential.length == 0) {
            //     return "Owner has not attached telegram credential(bot_token) so cannot send any messages"
            // }

            const bot_token = process.env.TELEGRAM_BOT_TOKEN!
            //TODO uncomment these after integrating frontend
            // credential=credential[0]
            // const bot_token=credential.data?.bot_token
            if (!bot_token) {
                console.log('bot_token not found');
                return "bot_token not found to send telegram message";
            }

            const url = `https://api.telegram.org/bot${bot_token}/sendMessage`
            const { data: response } = await axios.post(url, {
                chat_id,
                text,
                parse_mode: "HTML"
            })
            console.log('response : ', response);

            const promise = new Promise((resolve, reject) => {
                const workflowInstanceIdStr = workflowInstanceId.toString()
                const toolInstanceIdStr = (toolInstance._id).toString()
                if (waitingToolInstances.has(workflowInstanceIdStr)) {
                    const obj = waitingToolInstances.get(workflowInstanceIdStr)
                    obj[toolInstanceIdStr] = resolve
                    waitingToolInstances.set(workflowInstanceIdStr, obj)
                } else {
                    const obj = {}
                    obj[toolInstanceIdStr] = resolve
                    waitingToolInstances.set(workflowInstanceIdStr, obj)
                }
                console.log('waitingToolInstances : ', waitingToolInstances);

            })
            return promise
        } catch (error) {
            console.log('ERROR : telegram_send_message_and_wait_for_response_toolFN : ', error);
            return "error sending message on telegram and waiting for response"
        }
    }

}