import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin_Login from "./components/Admin_Login";
import Admin_Dashboard from "./Private_routes/Admin_Dashboard";
import ProtectedRoute from "./Private_routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // CRITICAL: Ensure this is imported

function App() {
  return (
    <>
      {/* Container must be outside Routes */}
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <Routes>
        <Route path="/" element={<Admin_Login />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <Admin_Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;