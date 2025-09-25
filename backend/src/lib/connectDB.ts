import mongoose from "mongoose";
export default async function connectDB(){
    await mongoose.connect(`${process.env.MONGODB_URI!}/n8n_clone`)
    console.log('DB connected successfully');
}