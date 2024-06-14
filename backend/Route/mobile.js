import express from "express";
import {
  addItemToInventory,
  getAllInventoryOfUser,
  getFilteredRecords,
  markItemAsSold,
  getAllSoldItems,
  totalDailyPurchasing,
  totalWeeklyPurchasing,
  totalMonthlyPurchasing,
  totalSellingDaily,
  totalSellingWeekly,
  totalSellingMonthly,
  getmobiles,
} from "../Controller/MobileController.js";
import authenticateToken from "../Middleware/jwt-auth.js";
const mobileRouter = express.Router();
mobileRouter.post("/add", authenticateToken, addItemToInventory);
mobileRouter.post("/get", authenticateToken, getAllInventoryOfUser);
mobileRouter.post("/filter", authenticateToken, getFilteredRecords);
mobileRouter.post("/marksold", authenticateToken, markItemAsSold);
mobileRouter.post("/getsold", authenticateToken, getAllSoldItems);
mobileRouter.get(
  "/getTodayPurchasing",
  authenticateToken,
  totalDailyPurchasing
);
mobileRouter.get(
  "/getWeeklyPurchasing",
  authenticateToken,
  totalWeeklyPurchasing
);
mobileRouter.get(
  "/getMonthlyPurchasing",
  authenticateToken,
  totalMonthlyPurchasing
);
mobileRouter.get("/getTodaySelling", authenticateToken, totalSellingDaily);
mobileRouter.get("/getWeeklySelling", authenticateToken, totalSellingWeekly);
mobileRouter.get("/getMonthlySelling", authenticateToken, totalSellingMonthly);
mobileRouter.get("/mobile", getmobiles);

export default mobileRouter;
