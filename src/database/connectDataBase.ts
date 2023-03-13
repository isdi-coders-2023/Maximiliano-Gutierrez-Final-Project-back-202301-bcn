import mongoose from "mongoose";
import createDebug from "debug";

const debug = createDebug("techno-api:*");

const connectDataBase = async (url: string) => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(url);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export default connectDataBase;
