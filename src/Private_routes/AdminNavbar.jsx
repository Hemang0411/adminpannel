// src/components/AdminNavbar.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ pageTitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-100 border-b border-slate-300 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
      <button
        onClick={() => {
          dispatch(logout());
          navigate("/");
        }}
        className="text-sm px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium border border-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
