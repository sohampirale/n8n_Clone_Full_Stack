import mongoose,{Schema} from "mongoose"
const ObjectId=Schema.Types.ObjectId;

const nodeActionSchema=new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  queueName:{
    type:String,
    required:true
  },
  icon:{
    type:String,
    default:"https://getumbrel.github.io/umbrel-apps-gallery/n8n/icon.svg"
  },
  publicallyAvailaible:{
    type:Boolean,
    default:true
  }
})

const nodeSchema=new Schema({
  nodeActionId:{
    type:ObjectId,
    ref:"NodeAction",
    required:true
  },
  workflowId:{
    type:ObjectId,
    ref:"Workflow",
    required:true
  },
  data:{
    type:Schema.Types.Mixed,
    default:{}
  },
})

const nodeInstanceSchema= new Schema({
  executeWorkflowId:{
    type:String,
    required:true
  },
  nodeId:{
    type:ObjectId,
    ref:"Node",
    required:true
  },
  workflowId:{
    type:ObjectId,
    ref:"Workflow",
    required:true
  },
  inData:{
    type:Schema.Types.Mixed,
    default:{}
  },
  outData:{
    type:Schema.Types.Mixed,
    default:{}
  },
  executeSuccess:{
    type:Boolean,
    default:false
  },
  error:{
    type:Schema.Types.Mixed,
    default:undefined
  }
})

export const NodeAction = mongoose.model("NodeAction",nodeActionSchema)
export const Node = mongoose.model("Node",nodeSchema)
export const NodeInstance = mongoose.model("NodeInstance",nodeInstanceSchema)

