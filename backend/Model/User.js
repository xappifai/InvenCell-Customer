import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  ffllaagg: { type: Boolean, required: true },
  cnic: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const User = mongoose.model("Users", userSchema);

export default User;
