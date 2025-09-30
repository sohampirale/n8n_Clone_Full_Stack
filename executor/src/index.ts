import dotenv from "dotenv"
import { getRedisClient } from "./helpers/redisClient"
import Executor from "./lib/Executor"
import type { IstartExecutionObject } from "./interfaces"
import { connectDB } from "./lib/connectDB"
dotenv.config()

async function startWorker() {
    await connectDB()
    worker()
}

async function worker() {
    while(1){
        try {
            const redis = await getRedisClient()
            const {element}: {element:IstartExecutionObject} = await redis.brPop("executor:trigger", 0)
            const startExecutionObject=JSON.parse(element)
            console.log('startExecutionObject : ', startExecutionObject);
            const executor = new Executor(startExecutionObject)
            await executor.startExecution()
        } catch (error) {
            console.log('error : ', error);
        }
    }
}

startWorker()