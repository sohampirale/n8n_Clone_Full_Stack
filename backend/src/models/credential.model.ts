import mongoose, { Schema } from "mongoose"
const ObjectId = Schema.Types.ObjectId;

/* might be necessary for accepting credentials with few optional fields
const requiredFieldsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})*/

const credentialFormSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  requiredFields: [{
    type:String
  }],
  publicallyAvailaible: {
    type: Boolean,
    default: true
  },
  baseUrl:{
    type:String,
    default:null
  }
}, {
  timestamps: true
})

const credentialSchema = new Schema({
  credentialFormId: {
    type: ObjectId,
    ref: "CredentialForm",
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
  authorizedUsers: [{
    type: ObjectId,
    ref: "User"
  }],
  active:{
    type:Boolean,
    default:true
  }
}, {
  timestamps: true
})

export const CredentialForm = mongoose.model("CredentialForm", credentialFormSchema)
export const Credential = mongoose.model("Credential", credentialSchema)