import mongoose from "mongoose";

const mobileSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  colors: { type: [String], required: true },
  storage: { type: [String], required: true },
});

const Mobile = mongoose.model("Mobile", mobileSchema);
export default Mobile;
