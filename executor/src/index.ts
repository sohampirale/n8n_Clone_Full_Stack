import dotenv from "dotenv"
dotenv.config()
import Executor, { waitingToolInstances } from "./lib/Executor"
import type { IstartExecutionObject } from "./interfaces"
import { connectDB } from "./lib/connectDB"
import { createClient } from "redis";
import { ToolInstance } from "./models/tool.model"

const executorsMap=new Map()

async function startWorker() {
    await connectDB()
    executionWorker()
    telegramSendMessageAndWaitNodeWorker()
    telegramSendMessageAndWaitToolWorker()
}

async function executionWorker() {
    try {
        const redis = await createClient({
            url:process.env.REDIS_URL
        })
        await redis.connect()
        console.log('executorRedis client connected successfully');
        
        while(1){
            try {
                console.log('Doing brPop');
                const {element}: {element:IstartExecutionObject} = await redis.brPop("executor:trigger", 0)
                const startExecutionObject=JSON.parse(element)
                console.log('startExecutionObject : ', startExecutionObject);
                const workflowInstanceId=startExecutionObject.workflowInstanceId
                console.log('workflowInstanceId : ',workflowInstanceId);
                if(!workflowInstanceId)continue;

                const executor = new Executor(startExecutionObject)

                executorsMap.set(workflowInstanceId.toString(),executor)
                console.log('updated executorsMap : ',executorsMap);
                
                executor.startExecution()
            } catch (error) {
                console.log('error : ', error);
            }
        }
    } catch (error) {
        console.log('ERROR : executionWorker : ',error);
        console.log('Failed to connect to redid db,exiting gracefully');
        process.exit()
    }
}

async function telegramSendMessageAndWaitNodeWorker(){
    try {
        const redis =createClient({
            url:process.env.REDIS_URI!
        })
        await redis.connect()
        while(1){
            try {
                const {element}:{element:any}= await redis.brPop("executor:action:telegram_on_message",0)

                const data = JSON.parse(element)
                const {
                    workflowInstanceId,
                    nodeId,
                    nodeInstanceId,
                    chat_id,
                    telegramWebhookData
                } = data;
                if(!workflowInstanceId || !nodeId || !nodeInstanceId || !chat_id){
                    console.log('Insufficient data provided data : ',data);
                    continue;
                }
                console.log('workflowInstanceId :',workflowInstanceId);
                console.log('executorsMap : ',executorsMap);
                
                if(!executorsMap.has(workflowInstanceId.toString())){
                    console.log('no executor object found for given workflowInstanceId in the executor:action:telegram_on_message');
                    continue;
                }

                const executor = executorsMap.get(workflowInstanceId.toString())

                console.log('-------RESUMED THE WAITING telegram_send_message_and_wait NODE--------');
                executor.resume_telegram_send_message_and_wait_for_response(nodeInstanceId,telegramWebhookData)
                
            }catch(error){
                console.log('ERROR :  telegramSendMessageAndWaitNodeWorker : ',error);
                
            }
        }
    } catch (error) {
        console.log('ERROR : telegramWebhooksWorker : ',error);
        console.log('Failed to connect to redid db,exiting gracefully');
        process.exit()
    }
}

async function telegramSendMessageAndWaitToolWorker(){
    try {
        const redis =createClient({
            url:process.env.REDIS_URI!
        })
        await redis.connect()
        while(1){
            try {
                const {element}:{element:any}= await redis.brPop("executor:tool:telegram_on_message",0)
                console.log('inside telegramSendMessageAndWaitToolWorker');
                
                const data = JSON.parse(element)
                const {
                    workflowInstanceId,
                    toolId,
                    toolInstanceId,
                    chat_id,
                    telegramWebhookData
                } = data;

                if(!workflowInstanceId || !toolId || !toolInstanceId || !chat_id){
                    console.log('Insufficient data provided data : ',data);
                    continue;
                }
                const text = telegramWebhookData?.message?.text

                console.log('workflowInstanceId :',workflowInstanceId);

                const workflowInstanceIdStr = workflowInstanceId.toString()
                console.log('workflowInstanceId : ',workflowInstanceId);
                console.log('toolInstanceId : ',toolInstanceId);
                
                if(waitingToolInstances.has(workflowInstanceIdStr)){
                    const obj=waitingToolInstances.get(workflowInstanceIdStr)
                    const toolInstanceIdStr = toolInstanceId.toString()
                    if(obj[toolInstanceIdStr]){
                        
                        const resolve=obj[toolInstanceId]
                        console.log('resolve obj : ',resolve);
                        const toolInstance= await ToolInstance.findById(toolInstanceId)
                        if(toolInstance){
                            toolInstance.waiting=false;
                            toolInstance.waitingIdentifier=null
                            await toolInstance?.save()
                            delete obj[toolInstanceId]
                        }
                        resolve(`message received  after waiting for response : ${text}`)
                    } else {
                        console.log('resolve obj not found for given toolInstanceId : ',toolInstanceId);
                    }

                } else {
                    console.log('no obj found for this workflowInstanceId : ',workflowInstanceId);
                    
                }
                
            }catch(error){
                console.log('ERROR :  telegramSendMessageAndWaitToolWorker : ',error);
                
            }
        }
    } catch (error) {
        console.log('ERROR : telegramSendMessageAndWaitToolWorker : ',error);
        console.log('Failed to connect to redid db,exiting gracefully');
        process.exit()
    }
}

startWorker()