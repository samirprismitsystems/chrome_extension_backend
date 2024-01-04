const { MONGO_URI } = require("../config");
const mongoose = require("mongoose");

const setupDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB Already Connected!");
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (ex) {
    throw new Error("Failed to connect to the database!");
  }
};

module.exports = setupDB;
