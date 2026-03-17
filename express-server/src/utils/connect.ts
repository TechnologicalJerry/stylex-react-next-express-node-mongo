import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    logger.info("DB connected");
    return true;
  } catch (error) {
    logger.error("Could not connect to db");
    return false;
  }
}

export default connect;
