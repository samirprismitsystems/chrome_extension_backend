import { MONGO_URI } from "../../config";
const mongoose = require("mongoose");

export const setupDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB Already Connected!");
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (ex: any) {
    throw new Error("Failed to connect to the database!");
  }
};
