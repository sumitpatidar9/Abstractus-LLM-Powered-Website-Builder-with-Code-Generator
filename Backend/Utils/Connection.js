import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongo_url = process.env.MONGO_URL;


const connectDB = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log('MongoDB connected');
  }  
  catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export {connectDB};
