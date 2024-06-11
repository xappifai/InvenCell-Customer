import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = authenticateToken(token);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const authenticateToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expiryDate = decodedToken.exp * 1000; // Convert to milliseconds
    if (Date.now() >= expiryDate) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default PrivateRoutes;
