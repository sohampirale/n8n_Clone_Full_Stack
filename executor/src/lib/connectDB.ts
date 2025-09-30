import mongoose from "mongoose";

export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        console.log('DB connected successfully');
    } catch (error) {
        console.log('ERROR : connectDB : ',error);
        console.log('Failed to connect to DB,existing gracefully');
        process.exit()
    }
}