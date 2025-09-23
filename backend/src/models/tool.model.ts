import mongoose,{Schema} from "mongoose"
const ObjectId=Schema.Types.ObjectId;

const toolFormSchema=new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  description:{
    type:String,
    required:true
  },
  schema:{
    type:Schema.Types.Mixed,
    default:{}
  },
  func:{
    type:String,
    required:true
  },
  language:{
    type:String,
    default:"javascript"
  },
  maxIterations:{
    type:Number,
    max:10,
    default:5
  },
  owner:{
    type:ObjectId,
    ref:"User"
  },
  publicallyAvailaible:{
    type:Boolean,
    default:true
  }
},{
  timestamps:true
})

const toolSchema=new Schema({
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
  agentNodeId:{
    type:ObjectId,
    ref:"Node"
  },
  data:{
    type:Schema.Types.Mixed,
    default:{}
  },
},{
  timestamps:true
})

export const ToolForm = mongoose.model("ToolForm",toolFormSchema)
export const Tool = mongoose.model("Tool",toolSchema)