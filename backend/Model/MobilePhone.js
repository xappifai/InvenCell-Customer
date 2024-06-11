import mongoose from "mongoose";

const { Schema } = mongoose;

const InventorySchema = new Schema({
  Email: { type: String, required: true },
  CNIC: { type: String, required: true },
  BrandName: { type: String, required: true },
  Model: { type: String, required: true },
  AvailablityStatus: { type: Boolean, required: true, default: true },
  Color: { type: String, required: true },
  PurchasingPrice: { type: Number, required: true },
  PurchaseDate: { type: String, required: true },
  SellingPrice: { type: Number, required: true, default: 0.0 },
  NetworkStatus: { type: String, required: true },
  IMEIList: [{ type: String, required: true }],
  CustomerName: { type: String, required: true },
  CustomerCNIC: { type: String, required: true },
  CustomerAddress: { type: String, required: true },
  CustomerPhoneNumber: { type: String, required: true },
  PurchaserName: { type: String, required: true },
  PurchaserCNIC: { type: String, required: true },
  PurchaserAddress: { type: String, required: true },
  PurchaserPhoneNumber: { type: String, required: true },
});

// Create unique index on IMEIList
InventorySchema.index({ IMEIList: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
