import connectDB from "../lib/connectDB.js";

export default async function startServer(app:any){
  try {
    await connectDB()
    app.listen(process.env.PORT,()=>{
      console.log('Server listening on port : ',process.env.PORT);
    })
  } catch (error) {
    console.log('Failed to connect DB,shutting down gracefully');
    process.exit(0)
  }
}