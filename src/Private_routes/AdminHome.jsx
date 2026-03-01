import React from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminHome = () => {
  const { username } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Fixed Navbar */}
        <AdminNavbar pageTitle="Home" />
        
        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-2xl bg-white border border-slate-300 rounded shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 1 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Welcome back,{" "}
                    <span className="text-blue-600 font-bold">
                      {username || "Admin"}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">
                    Use the sidebar navigation to manage employer registrations
                    and job postings. All pending items will be displayed in
                    their respective sections with full control.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-300 rounded-b text-center">
              <p className="text-xs text-gray-500">SkillBridge Admin Dashboard</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
