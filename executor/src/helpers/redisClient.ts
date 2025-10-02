import { createClient } from "redis";

let isConnected=false;
const redis =createClient({
    url:process.env.REDIS_URI!
})

export async function getRedisClient(){
    if(isConnected)return redis;
    try {
        await redis.connect()
        isConnected=true;
        console.log('Redis db connected successfully');
        return redis
    } catch (error) {
        console.log('ERROR ::  getRedisClient : ',error);
        console.log('Failed to connect to redis DB,exiting gracefully');
        isConnected=false;
        process.exit()
    }
}