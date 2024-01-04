import mongoose from "mongoose";

let userModel: mongoose.Model<any>;

try {
  // Try to retrieve the existing model
  userModel = mongoose.model("users");
} catch (error) {
  // If the model doesn't exist, create it
  const userSchema = new mongoose.Schema({
    nickname: String,
    name: String,
    picture: String,
    email: String,
    updated_at: String,
    email_verified: Boolean,
    sub: String,
  });

  userModel = mongoose.model("users", userSchema);
}

export default userModel;
