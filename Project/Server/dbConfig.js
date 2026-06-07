const mongoose = require("mongoose");
const logger = require("./utils/logger.js");

const connectDb = async () => {
  if (!process.env.MONGO_URL) {
    logger.error("MONGO_URL is not set. Cannot start without a database.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("DB Connected");
  } catch (error) {
    // Fail fast: do not let the API boot in a broken state.
    logger.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDb,
};
