import mongoose, { Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

const workflowSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  trigger: {
    type: ObjectId,
    ref: "Trigger",
    default: null
  },
  nodes: {
    type: [{
      type: ObjectId,
      ref: "Node"
    }],
    default:[]
  },
  active: {
    type: Boolean,
    default: true
  },
  tools:[{
    type:ObjectId,
    ref:'Tool'
  }],
  llms:[{
    type:ObjectId,
    ref:"LLM"
  }]
},{
  timestamps:true
})

const workflowInstanceSchema = new Schema({
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
  triggerInstanceId:{
    type:ObjectId,
    ref:"TriggerInstance",
    default:null
  },
  executedNodesInstanceIds:[{
    type:ObjectId,
    ref:"NodeInstance",
    default:[]
  }]
},{
  timestamps:true
})

const Workflow = mongoose.model("Workflow", workflowSchema);
export const WorkflowInstance = mongoose.model('WorkflowInstance',workflowInstanceSchema)

export default Workflow;