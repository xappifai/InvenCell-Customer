import Expense from "../Model/Expense.js";
import mongoose from "mongoose";

const addTodayExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.userId;

    const expense = new Expense({
      user: userId,
      amount,
      description,
    });

    await expense.save();

    res.send(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    const userId = req.user.userId;

    const expense = await Expense.findOne({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (amount !== undefined) {
      expense.amount = amount;
    }
    if (description !== undefined) {
      expense.description = description;
    }

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTodayExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const total = await calculateTotalExpensesForToday(userId);

    return res.status(total ? 200 : 404).json({ total });
  } catch (error) {
    console.error("Error getting today's expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWeeklyExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const total = await calculateTotalExpensesForWeek(userId);

    return res.status(total ? 200 : 404).json({ total });
  } catch (error) {
    console.error("Error getting weekly expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const total = await calculateTotalExpensesForMonth(userId);

    return res.status(total ? 200 : 404).json({ total });
  } catch (error) {
    console.error("Error getting monthly expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getlisttodayExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayExpenses = await Expense.find({
      user: userId,
      timestamp: { $gte: startOfToday },
    });

    res.json(todayExpenses);
  } catch (error) {
    console.error("Error getting today's expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getlistWeeklyExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const weeklyExpenses = await Expense.find({
      user: userId,
      timestamp: { $gte: startDate },
    });

    res.json(weeklyExpenses);
  } catch (error) {
    console.error("Error getting weekly expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getlistMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 29);

    const monthlyExpenses = await Expense.find({
      user: userId,
      timestamp: { $gte: startDate },
    });

    res.json(monthlyExpenses);
  } catch (error) {
    console.error("Error getting monthly expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function calculateTotalExpensesForToday(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalExpensesToday = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return totalExpensesToday.length > 0 ? totalExpensesToday[0].total : 0;
}

async function calculateTotalExpensesForWeek(userId) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  const totalExpensesWeek = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return totalExpensesWeek.length > 0 ? totalExpensesWeek[0].total : 0;
}

async function calculateTotalExpensesForMonth(userId) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 29);

  const totalExpensesMonth = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return totalExpensesMonth.length > 0 ? totalExpensesMonth[0].total : 0;
}

export {
  addTodayExpense,
  getTodayExpense,
  getWeeklyExpense,
  getMonthlyExpense,
  updateExpense,
  deleteExpense,
  getlisttodayExpenses,
  getlistWeeklyExpense,
  getlistMonthlyExpense,
};
