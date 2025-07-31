import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "blog",
    });
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
