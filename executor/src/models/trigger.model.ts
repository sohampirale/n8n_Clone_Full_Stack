import mongoose,{Schema} from "mongoose"
const ObjectId=Schema.Types.ObjectId;

const triggerActionSchema=new Schema({
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
},{
  timestamps:true
})

const triggerSchema=new Schema({
  triggerActionId:{
    type:ObjectId,
    ref:"TriggerAction",
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
},{
  timestamps:true
})

const triggerInstanceSchema= new Schema({
  workflowInstanceId:{
    type:ObjectId,
    ref:"WorkflowInstance",
    required:true
  },
  triggerId:{
    type:ObjectId,
    ref:"Trigger",
    required:true
  },
  workflowId:{
    type:ObjectId,
    ref:"Workflow",
    required:true
  },
  owner:{
    type:ObjectId,
    ref:"User",
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
    default:true
  },
  error:{
    type:Schema.Types.Mixed,
    default:undefined
  }
},{
  timestamps:true
})

export const TriggerAction = mongoose.model("TriggerAction",triggerActionSchema)
export const Trigger = mongoose.model("Trigger",triggerSchema)
export const TriggerInstance = mongoose.model("TriggerInstance",triggerInstanceSchema)

