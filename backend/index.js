import "dotenv/config";
import express from "express";
import router from "./Route/Route.js";
import mobileRouter from "./Route/mobile.js";
import expenseRouter from "./Route/Expense.js";
import connection from "./db.js";
import cors from "cors";

const app = express();
app.use(cors());
const port = process.env.port || 9434;

app.use(express.json()); // For parsing application/json
connection();
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

app.use("/api", router);
app.use("/mobile", mobileRouter);
app.use("/expense", expenseRouter);
