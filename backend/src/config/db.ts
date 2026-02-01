import mongoose from "mongoose";
import ENV from "../lib/env.js";


const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log("Database connected successfully");
    } catch (err: any) {
        console.log("Error connecting to the Database, check error logs for more details: ", err);
        process.exit(1);
    }
}

export default connectDB;