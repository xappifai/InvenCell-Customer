import express from "express";
const expenseRouter = express.Router();

import { addTodayExpense, getTodayExpense, getWeeklyExpense, getMonthlyExpense,updateExpense,deleteExpense,getlisttodayExpenses,getlistWeeklyExpense,getlistMonthlyExpense } from "../Controller/ExpenseController.js";
import authenticateToken from "../Middleware/jwt-auth.js";
expenseRouter.post('/add',authenticateToken,addTodayExpense)
expenseRouter.put('/update/:id',authenticateToken,updateExpense)
expenseRouter.delete('/delete/:id',authenticateToken,deleteExpense)
expenseRouter.get('/getTodayExpense',authenticateToken,getTodayExpense)
expenseRouter.get('/getWeeklyExpense',authenticateToken,getWeeklyExpense)
expenseRouter.get('/getMonthlyExpense',authenticateToken,getMonthlyExpense)
expenseRouter.get('/getlisttodayExpense',authenticateToken,getlisttodayExpenses)
expenseRouter.get('/getlistWeeklyExpense',authenticateToken,getlistWeeklyExpense)
expenseRouter.get('/getlistMonthlyExpense',authenticateToken,getlistMonthlyExpense)
export default expenseRouter;