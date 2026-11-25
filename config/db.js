// 1.1 Load environment variables from the .env file 
import 'dotenv/config';
// 1.3 Import Mongoose to connect to and interact with MongoDB
import mongoose from "mongoose";

// 2.1 Retrieve MongoDB connection string from environment variables
const uri = process.env.MONGO_URI;

// 2.2 Create an asynchronous function to connect to MongoDB
const connectDB = async () => {
    try{
        //2.3 Attempt to connect to MongoDB
        await mongoose.connect(uri);

        //2.4 Display a message if connection succeeds
        console.log("MongoDB connected successfully!");

    }catch(error) {
        //2.5 Handle Connection errors
        console.error("MongoDB connection failed:" , error.message);
        throw error;
    }
};

export default connectDB;
