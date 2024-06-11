import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignInSide from "./Screen/Signin";
import SignUp from "./Screen/Signup"; // Assuming you have a SignUp component
import Home from "./Screen/Home";
import AvailableStock from "./Screen/AvailableStock";
import SoldStock from "./Screen/SoldStock";
import AddStock from "./Screen/AddStock";
import Expense from "./Screen/Expense";
import ForgotPassword from "./Screen/ForgotPassword";
import PrivateRoutes from "./Assets/ProtectRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/available" element={<AvailableStock />} />
        <Route path="/sold" element={<SoldStock />} />
        <Route path="/add" element={<AddStock />} />
        <Route path="/expense" element={<Expense />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
