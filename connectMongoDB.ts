import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(String(process.env.CONNECTION_URL));
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
