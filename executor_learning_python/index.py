import redis
import json

redisClient = redis.Redis(host='localhost',port=6379,db=0)
queue_name = "executor:trigger"
print('redis db connected')

# while True:
#     item = redisClient.brpop(queue_name, timeout=0)  
#     if item:
#         (queueBytes, valueBytes )= item
#         queue=queueBytes.decode('utf-8')
#         value = valueBytes.decode('utf-8')
#         value = json.loads(value)
#         print('queue : ',queue)
#         print('value : ',value) 
#         print('value.workflowInstnceId : ',value["workflowInstanceId"])


class Executor:
    
    @staticmethod
    def main():
        while True:
            (_,valueByte) = redisClient.brpop("executor:trigger", timeout=0)  
            startExecutionObject = json.loads(valueByte.decode('utf-8'))
            print(f"startExecutionObject : {startExecutionObject}")



Executor.main()