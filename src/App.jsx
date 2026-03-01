import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin_Login from "./components/Admin_Login";
import AdminNavbar from "./Private_routes/AdminNavbar"
import AdminSidebar from "./Private_routes/AdminSidebar"
import AdminHome from "./Private_routes/AdminHome";
import AdminEmployers from "./Private_routes/AdminEmployers";
import AdminJobs from "./Private_routes/AdminJobs";
import ProtectedRoute from "./Private_routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <Routes>
        <Route path="/" element={<Admin_Login />} />
         <Route 
          path="/admin-sidebar" 
          element={
            <ProtectedRoute>
              <AdminSidebar/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-navbar" 
          element={
            <ProtectedRoute>
              <AdminNavbar/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-home" 
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-employers" 
          element={
            <ProtectedRoute>
              <AdminEmployers />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin-jobs" 
          element={
            <ProtectedRoute>
              <AdminJobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;