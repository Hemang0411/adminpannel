// src/pages/AdminEmployers.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPendingData, updateEmployerStatus } from "../Redux/employerSlice";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { toast } from "react-toastify";
import axios from "axios";

const AdminEmployers = () => {
  const [subTab, setSubTab] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const { token, username, password } = useSelector((state) => state.auth);
  const pendingData = useSelector((state) => state.employers?.pendingData) || [];
  const dispatch = useDispatch();

  const fetchEmployers = async () => {
    console.log(token, username, password);
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/employers/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({
              username: username,
              password: password,
            }),
          },
        }
      );
      console.log(res.data.pendingEmployers);
      let employerList =
        res.data?.data ||
        res.data?.employers ||
        res.data.pendingEmployers ||
        [];
      employerList = Array.isArray(employerList) ? employerList : [];

      employerList = employerList.map((emp) => ({
        ...emp,
        status: emp.status || "Pending",
      }));

      dispatch(setPendingData(employerList));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch employers");
      dispatch(setPendingData([]));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/employer/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}`, user: JSON.stringify({ username, password }) } }
      );
      dispatch(updateEmployerStatus(id));
      fetchEmployers();
      toast.success("Employer Approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error approving employer");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/employer/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}`, user: JSON.stringify({ username, password }) } }
      );
      dispatch(updateEmployerStatus(id));
      fetchEmployers();
      toast.success("Employer Rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting employer");
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, [token, username, password, dispatch]);

  const filteredEmployers = pendingData.filter(
    (emp) =>
      (emp.status?.toLowerCase() || "pending") === subTab.toLowerCase()
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Fixed Navbar */}
        <AdminNavbar pageTitle="Employer Registrations" />
        
        {/* Subtab Row */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center justify-between sticky top-[80px] z-10 bg-opacity-95">
          <div className="flex gap-2">
            {["Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`text-sm px-4 py-1.5 rounded border transition-all ${
                  subTab === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            className="text-sm text-blue-600 hover:text-blue-700 border border-blue-300 hover:bg-blue-50 rounded p-1.5"
            onClick={fetchEmployers}
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {loading && (
            <div className="text-center py-6 text-gray-500 text-sm">Loading...</div>
          )}

          {!loading && (
            <div className="space-y-4">
              {filteredEmployers.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No {subTab} Employers Found
                </div>
              ) : (
                filteredEmployers.map((emp) => (
                  <div
                    key={emp._id}
                    className="bg-white border border-slate-300 rounded shadow-sm p-4"
                  >
                    {/* Header with Status */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">{emp.company_name}</h2>
                        <p className="text-xs text-gray-600">{emp.full_name}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          emp.status === "Approved"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : emp.status === "Rejected"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {emp.status || "Pending"}
                      </span>
                    </div>

                    {/* Contact Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Email */}
                      <div className="border-r border-slate-200 pr-4">
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">{emp.email}</p>
                      </div>

                      {/* Phone */}
                      <div className="border-r border-slate-200 pr-4">
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Phone
                        </label>
                        <p className="text-sm text-gray-900">{emp.phone}</p>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1 flex items-center">
                          LinkedIn
                          <button
                            onClick={() =>
                              window.open(emp.linkedin_url, "_blank", "noopener,noreferrer")
                            }
                            className="ml-2 text-xs px-2 py-0.5 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 rounded text-blue-700"
                          >
                            View →
                          </button>
                        </label>
                        <p className="text-xs text-gray-500">Profile opens in new tab</p>
                      </div>
                    </div>

                    {/* Company Description - only show for Pending */}
                      {subTab === "Pending" && emp.company_description && (
                        <div className="mb-4 pt-3">
                          <label className="text-xs font-semibold text-gray-600 block mb-1">
                            Company Description
                          </label>
                          <p className="text-sm text-gray-900 leading-relaxed max-w-2xl line-clamp-3">
                            {emp.company_description}
                          </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {emp.status === "Pending" && (
                      <div className="flex gap-2 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => handleApprove(emp._id)}
                          className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded border border-blue-600"
                          disabled={loading}
                        >
                          Approve Employer
                        </button>
                        <button
                          onClick={() => handleReject(emp._id)}
                          className="text-sm px-3 py-1.5 bg-white text-gray-700 rounded border border-blue-600 hover:bg-gray-50"
                          disabled={loading}
                        >
                          Reject Employer
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminEmployers;
