import mongoose from "mongoose";

export const connectDynamo = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority&appName=thrico-news`
    );
    console.log("connted to db");
  } catch (error) {
    console.log(error);
  }
};
