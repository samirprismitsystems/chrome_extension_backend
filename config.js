const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

module.exports = { MONGO_URI, PORT };
