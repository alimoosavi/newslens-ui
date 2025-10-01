import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/AuthPage";
import ChatLayout from "./chat/ChatLayout";

// Protect private routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <ChatLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
