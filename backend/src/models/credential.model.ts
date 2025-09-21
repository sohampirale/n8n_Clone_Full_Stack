import mongoose,{Schema} from "mongoose"
const ObjectId=Schema.Types.ObjectId;

const requiredFieldsSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  required:{
    type:Boolean,
    default:true
  }
})

const credentialFormSchema= new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  requiredFields:[requiredFieldsSchema]
})

const credentialSchema= new Schema({
  credentialFormId:{
    type:ObjectId,
    ref:"CredentialForm",
    required:true
  },
  owner:{
    type:ObjectId,
    ref:"User",
    required:true
  },
  data:{
    type:Schema.Types.Mixed,
    default:{}
  },
  authorizedUsers:[{
    type:ObjectId,
    ref:"User"
  }],
})

export const CredentialForm = mongoose.model("CredentialForm",credentialFormSchema)
export const Credential = mongoose.model("Credential",credentialSchema)