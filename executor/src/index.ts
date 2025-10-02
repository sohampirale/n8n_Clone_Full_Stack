import dotenv from "dotenv"
dotenv.config()
import { getRedisClient } from "./helpers/redisClient"
import Executor from "./lib/Executor"
import type { IstartExecutionObject } from "./interfaces"
import { connectDB } from "./lib/connectDB"
import { createClient } from "redis";
import mongoose, { mongo } from "mongoose"
import { Node, NodeInstance } from "./models/node.model"
import { ToolInstance } from "./models/tool.model"


async function startWorker() {
    await connectDB()
    executionWorker()
    telegramWebhooksWorker()
}

async function executionWorker() {
    try {
        const redis = await getRedisClient()
        console.log('executorRedis client connected successfully');
        
        while(1){
            try {
                console.log('Doing brPop');
                const {element}: {element:IstartExecutionObject} = await redis.brPop("executor:trigger", 0)
                const startExecutionObject=JSON.parse(element)
                console.log('startExecutionObject : ', startExecutionObject);
                const executor = new Executor(startExecutionObject)
                await executor.startExecution()
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

async function telegramWebhooksWorker(){
    try {
        const TGRedisClient =createClient({
            url:process.env.REDIS_URI!
        })
        await TGRedisClient.connect()
        while(1){
            try {
                const {element}= await TGRedisClient.brPop("executor:telegram_webhook",0)
                const data = JSON.parse(element)
                console.log('data : ',data);
                const chat_id=data?.message?.chat?.id
                if(!chat_id){
                    console.log('chat_id not found,doing nothing');
                    continue;
                } else if(!data.user){
                    console.log('No attached user found for the data');
                    continue;
                }
                const userIdStr=data.user?._id
                if(!userIdStr){
                    console.log('userId not found for the attached user');
                    continue;
                }
                const userId = new mongoose.Types.ObjectId(userIdStr)
                const message=data?.message?.text
                if(message=='/start'){
                    console.log('Someone started new conversation with telegram bot');
                    //finding out if there exists any workflow of owner:userId where the trigger is telegram_on_message
                    
                } else {
                    //message received for existing chat maybe
                    //figure out any telegram node thats waiting for this chat_id reesponse
                    const waitingNodeInstance = await NodeInstance.findOne({
                        owner:userId,
                        waiting:true,
                        waitingIdentifier:chat_id
                    })
                    if(waitingNodeInstance){
                        console.log('A Telegram send_message_and_wait_for_response_node was waiting for this message');
                    } else {
                        //find out if a telegram_send_message_and_wait_for_response_tool was waiting on this chat_id
                        const waitingToolInstance = await ToolInstance.findOne({
                            owner:userId,
                            waiting:true,
                            waitingIdentifier:chat_id
                        })
                        if(waitingToolInstance){
                            console.log('A Telegram send_message_and_wait_for_response_tool was waiting for this message');  
                        } else {
                            console.log('NOBODY is waiting for response from this chat_id');
                            //here if nobody is waiting that means user just started this new conversation then we can either
                            // 1.Tell them to send /start and what we do 
                            // 2.just find out the workflow thats having the telegram_on_message_as_trigger and let him handler the rest
                        }
                    }
                }

            } catch (error) {
                console.log('ERROR : BRPOP : telegramWebhooksWorker : ',error);
            }
        }
    } catch (error) {
        console.log('ERROR : telegramWebhooksWorker : ',error);
        console.log('Failed to connect to redid db,exiting gracefully');
        process.exit()
    }
}

startWorker()