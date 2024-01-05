const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin@cluster1.pqikgmr.mongodb.net/chrom_extension?retryWrites=true&w=majority";

module.exports = { MONGO_URI, PORT };
