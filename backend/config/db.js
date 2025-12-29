import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MONGO CONNECTED...");
    }catch(err){
        console.log(err);
        process.exit(1); // 1 means failure
    }
};
export default connectDB;