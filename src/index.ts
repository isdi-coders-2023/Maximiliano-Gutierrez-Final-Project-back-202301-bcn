import "./loadEnvironment.js";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDataBase from "./database/connectDataBase.js";
import mongoose from "mongoose";

const port = process.env.PORT ?? 5000;
const mongoDbUrl = process.env.MONGODB_CONNECTION_URL;

const debug = createDebug("techno-api:*");
mongoose.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

try {
  await connectDataBase(mongoDbUrl!);
  debug("Connected succesfully to database");

  await startServer(+port);
  debug(`Server listening on port ${port}`);
} catch (error) {
  debug(error.message);
}
