import mongoose from "mongoose";



const connectDB = async () => {
  try {
    //   const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`,
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }
    );
    console.log(
      `MongoDB connected !! DB HOST :${connectionInstance.connection.host.cyan.underline}`
    ); //jaha pe humara DB connect ho rah hai vo jagah show hogi isse
  } catch (error) {
    console.log("MONGODB connection error", error);
  }
};

export default connectDB;
