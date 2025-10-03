import mongoose, { Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

const llmSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    credentialId: {
        type: ObjectId,
        ref: "Credential",
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    workflowId: {
        type: ObjectId,
        ref: 'Worlflow',
        required: true
    },
    aiNodeId: {
        type: ObjectId,
        ref: 'Node',
        required: true
    }
}, {
    timestamps: true
})

export const LLM = mongoose.model("LLM", llmSchema)