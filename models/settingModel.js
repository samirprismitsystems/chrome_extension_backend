const mongoose = require("mongoose")

let settingModel = null;

try {
  // Try to retrieve the existing model
  settingModel = mongoose.model("setting");
} catch (error) {
  // If the model doesn't exist, create it
  const settingSchema = new mongoose.Schema({
    aliExpress: {
      appID: String,
      secretKey: String,
    },
    sallaAccount: {
      clientID: String,
      clientSecretKey: String,
    },
    settingID: String,
  });

  settingModel = mongoose.model("setting", settingSchema);
}

module.exports = settingModel;
