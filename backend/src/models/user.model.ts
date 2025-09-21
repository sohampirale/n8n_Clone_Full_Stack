import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
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

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    this.password=await bcrypt.hash(this.password,5)
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User",userSchema);

export default User;  
