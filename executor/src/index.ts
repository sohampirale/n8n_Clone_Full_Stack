import dotenv from "dotenv"
dotenv.config()
import { getRedisClient } from "./helpers/redisClient"
import Executor from "./lib/Executor"
import type { IstartExecutionObject } from "./interfaces"
import { connectDB } from "./lib/connectDB"
import { createClient } from "redis";


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
                const json = JSON.parse(element)
                console.log('json : ',json);
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