import bcrypt from "bcryptjs"; // Import bcrypt.js library
// import Inventory from "../Model/MobilePhone.js"; // Make sure to import your User model correctly
import Inventory from "../Model/Inventory.js";
import mongoose from "mongoose";
const decryptIMEIList = async (hashedIMEIList) => {
  try {
    // Decrypt each hashed IMEI in the list
    const actualIMEIList = await Promise.all(
      hashedIMEIList.map(async (hashedIMEI) => {
        // Use bcrypt.compare to decrypt the hashed IMEI
        const actualIMEI = await bcrypt.compare(hashedIMEI, hashedIMEI);
        return actualIMEI;
      })
    );
    return actualIMEIList; // Return the decrypted IMEI list
  } catch (error) {
    console.error("Error decrypting IMEI list:", error);
    throw error; // Throw error for handling in calling function
  }
};

export const totalSellingDaily = async (req, res) => {
  try {
    const email = req.user.email;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalSelling = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      {
        $match: {
          "Mobile.AvailablityStatus": false,
          "Mobile.SellingDate": { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.SellingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalSelling[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total daily selling:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const totalSellingMonthly = async (req, res) => {
  try {
    const email = req.user.email;
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const totalSelling = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      {
        $match: {
          "Mobile.AvailablityStatus": false,
          "Mobile.SellingDate": { $gte: thirtyDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.SellingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalSelling[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total monthly selling:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const totalDailyPurchasing = async (req, res) => {
  try {
    const email = req.user.email;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalPurchasing = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      { $match: { "Mobile.PurchaseDate": { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.PurchasingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalPurchasing[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total daily purchasing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const totalWeeklyPurchasing = async (req, res) => {
  try {
    const email = req.user.email;
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const totalPurchasing = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      {
        $match: {
          "Mobile.PurchaseDate": { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.PurchasingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalPurchasing[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total weekly purchasing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const totalSellingWeekly = async (req, res) => {
  try {
    const email = req.user.email;
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const totalSelling = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      {
        $match: {
          "Mobile.AvailablityStatus": false,
          "Mobile.SellingDate": { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.SellingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalSelling[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total weekly selling:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export const totalMonthlyPurchasing = async (req, res) => {
  try {
    const email = req.user.email;
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const totalPurchasing = await Inventory.aggregate([
      { $match: { Email: email } },
      { $unwind: "$Mobile" },
      {
        $match: {
          "Mobile.PurchaseDate": { $gte: thirtyDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Mobile.PurchasingPrice" },
        },
      },
    ]);

    res.status(200).json({ total: totalPurchasing[0]?.total || 0 });
  } catch (error) {
    console.error("Error calculating total monthly purchasing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const addItemToInventory = async (req, res) => {
  try {
    const {
      Email,
      CNIC,
      BrandName,
      Color,
      Model,
      PurchasingPrice,
      NetworkStatus,
      Storage,
      IMEIList,
      PurchaseDate,
      SellingPrice,
      CustomerName,
      CustomerCNIC,
      CustomerAddress,
      CustomerPhoneNumber,
      PurchaserName,
      PurchaserCNIC,
      PurchaserAddress,
      PurchaserPhoneNumber,
    } = req.body;

    // Create customer details
    const customerDetails = {
      Name: CustomerName,
      CNIC: CustomerCNIC,
      Address: CustomerAddress,
      PhoneNumber: CustomerPhoneNumber,
    };

    // Create purchaser details
    const purchaserDetails = {
      Name: PurchaserName,
      CNIC: PurchaserCNIC,
      Address: PurchaserAddress,
      PhoneNumber: PurchaserPhoneNumber,
    };

    // Create new mobile entry
    const newMobileEntry = {
      BrandName,
      Color,
      Model,
      PurchasingPrice,
      NetworkStatus,
      Storage,
      IMEIList,
      PurchaseDate,
      SellingPrice,

      Customer: customerDetails,
      Purchaser: purchaserDetails,
    };

    // Check for duplicate IMEI numbers
    const duplicateIMEI = await Inventory.findOne({
      "Mobile.IMEIList": { $in: IMEIList },
    });
    if (duplicateIMEI) {
      return res.status(400).json({
        success: false,
        error: "One or more IMEI numbers are already in use.",
      });
    }

    // Check if the inventory item already exists
    let inventoryItem = await Inventory.findOne({ Email, CNIC });

    if (inventoryItem) {
      // If the inventory item exists, add the new mobile entry to the Mobile array
      inventoryItem.Mobile.push(newMobileEntry);
    } else {
      // If the inventory item does not exist, create a new one
      inventoryItem = new Inventory({
        Email,
        CNIC,
        Mobile: [newMobileEntry],
      });
    }

    // Save the inventory item
    await inventoryItem.save();

    // Respond with the newly created or updated inventory item
    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Error adding mobile phone:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
// controllers/inventoryController.js

export const getAllInventoryOfUser = async (req, res) => {
  try {
    const { Email, CNIC } = req.body; // Use query parameters for GET request

    // Query the Inventory collection for documents with matching Email and CNIC
    const inventoryDocuments = await Inventory.find({ Email, CNIC }).select(
      "Mobile"
    );

    // Return the matching documents
    res.status(200).json({ success: true, data: inventoryDocuments });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching inventory:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getFilteredRecords = async (req, res) => {
  try {
    const {
      Email,
      CNIC,
      BrandName,
      AvailablityStatus,
      SearchModel,
      NetworkStatus,
    } = req.body;

    // Create a filter object based on the provided criteria
    const filter = {
      Email,
      CNIC,
      ...(BrandName && { BrandName }), // Only include BrandName if provided
      ...(AvailablityStatus !== undefined && { AvailablityStatus }), // Only include AvailablityStatus if provided
      ...(SearchModel && { Model: SearchModel }), // Only include Model if provided
      ...(NetworkStatus && { NetworkStatus }), // Only include NetworkStatus if provided
    };

    // Query the Inventory collection with the filter
    const inventoryRecords = await Inventory.find(filter);

    // Return the matching records
    res.status(200).json({ success: true, data: inventoryRecords });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// controllers/inventoryController.js

export const markItemAsSold = async (req, res) => {
  try {
    const {
      IMEIList,
      SellingPrice,
      SellerName,
      SellerCNIC,
      SellerAddress,
      SellerPhoneNumber,
      CustomerName,
      CustomerCNIC,
      CustomerAddress,
      CustomerPhoneNumber,
    } = req.body;

    // Get the current timestamp
    const currentTimestamp = new Date();

    // Update the matching Mobile items
    const updateResults = await Inventory.updateMany(
      {
        "Mobile.IMEIList": { $in: IMEIList },
        "Mobile.AvailablityStatus": true,
      },
      {
        $set: {
          "Mobile.$[elem].AvailablityStatus": false,
          "Mobile.$[elem].SellingPrice": SellingPrice,
          "Mobile.$[elem].SellingDate": currentTimestamp,
          "Mobile.$[elem].Customer.Name": CustomerName,
          "Mobile.$[elem].Customer.CNIC": CustomerCNIC,
          "Mobile.$[elem].Customer.Address": CustomerAddress,
          "Mobile.$[elem].Customer.PhoneNumber": CustomerPhoneNumber,
          "Mobile.$[elem].Purchaser.Name": SellerName,
          "Mobile.$[elem].Purchaser.CNIC": SellerCNIC,
          "Mobile.$[elem].Purchaser.Address": SellerAddress,
          "Mobile.$[elem].Purchaser.PhoneNumber": SellerPhoneNumber,
        },
      },
      {
        arrayFilters: [
          {
            "elem.IMEIList": { $in: IMEIList },
            "elem.AvailablityStatus": true,
          },
        ],
      }
    );

    if (updateResults.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "No matching available items found with provided IMEI(s)",
      });
    }

    // Return a success response
    res
      .status(200)
      .json({ success: true, message: "Items marked as sold successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error marking item as sold:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
export const getAllSoldItems = async (req, res) => {
  try {
    const { Email, CNIC } = req.body;

    // Query the Inventory collection for sold items with matching Email and CNIC
    const inventoryDocuments = await Inventory.find({
      Email,
      CNIC,
      "Mobile.AvailablityStatus": false, // Only select records with AvailablityStatus set to false within Mobile array (sold items)
    });

    // Filter to only include the sold Mobile items
    const soldItems = inventoryDocuments.flatMap((doc) =>
      doc.Mobile.filter((mobile) => mobile.AvailablityStatus === false)
    );

    // Return the sold items
    res.status(200).json({ success: true, data: soldItems });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching sold items:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
