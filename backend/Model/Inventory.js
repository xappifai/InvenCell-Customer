// models/Inventory.js
import mongoose from "mongoose";
import { Schema } from "mongoose";

// Custom validation function to check for duplicate IMEI numbers within the array
const uniqueArray = (value) =>
  Array.isArray(value) && new Set(value).size === value.length;

const customerSchema = new Schema({
  Name: { type: String, required: true },
  CNIC: { type: String, required: true },
  Address: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

const purchaserSchema = new Schema({
  Name: { type: String, default: "Anonymous" },
  CNIC: { type: String, default: "anonymous" },
  Address: { type: String, default: "Anonymous" },
  PhoneNumber: { type: String, default: "Anonymous" },
});

const mobileSchema = new Schema({
  BrandName: { type: String, required: true },
  Color: { type: String, required: true },
  Model: { type: String, required: true },
  PurchasingPrice: { type: Number, required: true },
  NetworkStatus: { type: String, required: true },
  Storage: { type: String, required: true },
  IMEIList: {
    type: [String],
    required: true,
    validate: {
      validator: uniqueArray,
      message: "IMEIList contains duplicate values within the mobile object",
    },
  },
  PurchaseDate: { type: Date, required: true },
  SellingPrice: { type: Number },
  SellingDate:{type: Date},
  AvailablityStatus: { type: Boolean, default: true },
  Customer: customerSchema,
  Purchaser: purchaserSchema,
});

const inventorySchema = new Schema({
  Email: { type: String, required: true, unique: true },
  CNIC: { type: String, required: true, unique: true },
  Mobile: [mobileSchema],
});

// Create a pre-save hook to check for duplicate IMEI numbers across all mobile objects
inventorySchema.pre("save", function (next) {
  const inventory = this;

  // Flatten the array of IMEILists
  const allIMEIs = inventory.Mobile.flatMap((mobile) => mobile.IMEIList);

  // Check for duplicates in the flattened array
  if (new Set(allIMEIs).size !== allIMEIs.length) {
    const err = new Error("Duplicate IMEI numbers found across mobile objects");
    next(err);
  } else {
    next();
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
