import mongoose, { Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

const llmSchema = new Schema({
    model: {
        type: String,
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
        required: true,
        unique: true // we can remove this and make sure everytime new worklflow is updated that time delete all the llms having that workflowId
    }
}, {
    timestamps: true
})

export const LLM = mongoose.model("LLM", llmSchema)