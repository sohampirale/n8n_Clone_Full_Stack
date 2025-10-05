import mongoose, { mongo, Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

const toolFormSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  systemQuery:{
    type:String,
    default:""
  },
  schema: {
    type: Schema.Types.Mixed,
    default: {}
  },
  func: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: "javascript"
  },
  maxIterations: {
    type: Number,
    max: 10,
    default: 5
  },
  owner: {
    type: ObjectId,
    ref: "User"
  },
  publicallyAvailaible: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: "https://imgs.search.brave.com/a3unk_Fc9CEQK0W6ZQz_IeOcEsfYhPpWxQzCPChQjYE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzQzLzk5LzU1/LzM2MF9GXzQ0Mzk5/NTUwNF9tZEFhakxS/V2J6SkJ2S2JRdHJp/SHVuWTZwZmdUQVJB/bC5qcGc"
  }
}, {
  timestamps: true
})

const toolSchema = new Schema({
  toolFormId: {
    type: ObjectId,
    ref: "ToolForm",
    required: true
  },
  aiNodeId: {
    type: ObjectId,
    ref: "Node",
    required: true
  },
  additionalDescription: {
    type: String,
    default: ""
  },
  workflowId: {
    type: ObjectId,
    ref: "Workflow",
    required: true
  },
  owner: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
}, {
  timestamps: true
})

//is this even necessary?
const toolInstanceSchema = new Schema({
  workflowInstanceId: {
    type: ObjectId,
    ref: "WorkflowInstance",
    required: true
  },
  toolId: {
    type: ObjectId,
    ref: "Tool",
    required: true
  },
  workflowId: {
    type: ObjectId,
    ref: "Workflow",
    required: true
  },
  owner:{
    type:ObjectId,
    ref:'User',
    required:true
  },
  aiNodeInstanceId: {
    type: ObjectId,
    ref: "Node",
    required: true
  },
  inData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  outData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  executeSuccess: {
    type: Boolean,
    default: true
  },
  error: {
    type: Schema.Types.Mixed,
    default: {}
  },
  waiting: {
    type: Boolean,
    default: false
  },
  waitingIdentifier: {
    type: String,
    default: null
  }
})

export const ToolForm = mongoose.model("ToolForm", toolFormSchema)
export const Tool = mongoose.model("Tool", toolSchema)
export const ToolInstance = mongoose.model("ToolInstance", toolInstanceSchema);
