// src/components/AdminSidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/admin-home" },
    { name: "Employer Registrations", path: "/admin-employers" },
    { name: "Employer Job Postings", path: "/admin-jobs" },
  ];

  const activeItem = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-300 h-screen flex flex-col sticky top-0">
      <div className="p-4 border-b border-slate-300">
        <h1 className="text-base font-bold text-white">Admin Panel</h1>
        <p className="text-slate-300 text-xs mt-1">SkillBridge Admin</p>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-2 text-sm rounded font-medium transition-all ${
              activeItem?.path === item.path
                ? "bg-blue-600 text-white border-r-4 border-blue-500"
                : "text-slate-200 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
