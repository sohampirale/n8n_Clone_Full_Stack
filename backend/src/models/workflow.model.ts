import mongoose, { Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

const nodeObj = new mongoose.Schema({
  nodeId: {
    type: ObjectId,
    ref: "Node",
    required: true
  },
  prerequisiteNodes: [{
    type: String,
  }],
})

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
  }
})

const Workflow = mongoose.model("Workflow", workflowSchema);

export default Workflow;
