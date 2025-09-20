import mongoose,{Schema} from "mongoose"
const ObjectId=Schema.Types.ObjectId;

const userSchema = new Schema({
  username :{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true,
  }
})

const User = mongoose.model("User",userSchema);

export default User;
