import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/car-rental`
    );
    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED!!\n", error.message);
    process.exit(1);
  }
};
 
export default connectDB;
