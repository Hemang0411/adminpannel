import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPendingData, updateEmployerStatus } from "../Redux/employerSlice";
import { logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Admin_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Job Posting");
  const [subTab, setSubTab] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token, username, password } = useSelector((state) => state.auth);
  const pendingData = useSelector((state) => state.employers.pendingData) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ALL FUNCTIONS EXACTLY SAME - NO CHANGES
  const fetchEmployers = async () => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);

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

      let employerList = [];

      if (Array.isArray(res.data)) {
        employerList = res.data;
      } else if (Array.isArray(res.data?.data)) {
        employerList = res.data.data;
      } else if (Array.isArray(res.data?.employers)) {
        employerList = res.data.employers;
      } else if (Array.isArray(res.data?.pendingEmployers)) {
        employerList = res.data.pendingEmployers;
      }

      dispatch(setPendingData(employerList));
    } catch (err) {
      setError("Failed to load employer registrations.");
      toast.error(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/employer/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({ username, password }),
          },
        }
      );

      dispatch(updateEmployerStatus(id));
      toast.success("Employer approved successfully");
      fetchEmployers();
    } catch {
      toast.error("Error approving employer");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/employer/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({ username, password }),
          },
        }
      );

      dispatch(updateEmployerStatus(id));
      toast.success("Employer rejected successfully");
      fetchEmployers();
    } catch {
      toast.error("Error rejecting employer");
    }
  };

  const filteredData =
    subTab === "All"
      ? pendingData
      : pendingData.filter(
          (emp) => emp.status?.toLowerCase() === subTab.toLowerCase()
        );

  useEffect(() => {
    if (activeTab === "Employer Registration") {
      fetchEmployers();
    }
  }, [activeTab]);

  return (
    <>
      {/* Full Width Layout with Fixed Sidebar */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Fixed Sidebar - 256px width */}
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-40">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">SkillBridge Admin</p>
          </div>

          <nav className="mt-10 px-4 space-y-1">
            {["Job Posting", "Candidate Applications", "Employer Registration"].map((name) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === name
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-800 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {name}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-4">
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all duration-200 hover:shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* FULL WIDTH Main Content - Takes remaining space */}
        <div className="ml-64 flex-1 min-h-screen">
          {/* Full Width Header */}
          <header className="bg-white border-b border-gray-200 px-12 pt-8 pb-6 shadow-sm">
            <h1 className="text-4xl font-bold text-gray-900">
              {activeTab}
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Manage platform operations</p>
          </header>

          {/* Full Width Content Area */}
          <main className="px-12 py-8">
            {activeTab === "Employer Registration" && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Full Width Subtabs */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                          subTab === tab
                            ? "bg-blue-600 text-white shadow-md hover:shadow-lg"
                            : "text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-4"></div>
                      <p className="text-xl text-gray-600 font-semibold">Loading employers...</p>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-24">
                      <svg className="w-20 h-20 mx-auto mb-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">No {subTab.toLowerCase()} employers</h3>
                      <p className="text-xl text-gray-600">Check back later for new registrations.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredData.map((emp) => (
                        <div key={emp._id} className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-200 hover:border-gray-300">
                          <div className="flex justify-between items-start mb-8">
                            <div className="flex-1 min-w-0">
                              <h2 className="text-3xl font-bold text-gray-900 mb-3 truncate">{emp.company_name}</h2>
                              <p className="text-2xl font-semibold text-gray-800 mb-4">{emp.full_name}</p>
                              <p className="text-lg text-gray-600 mb-1">{emp.email}</p>
                              <p className="text-lg text-gray-500">{emp.phone}</p>
                            </div>
                            <span className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-sm ml-6 flex-shrink-0 ${
                              emp.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200" :
                              emp.status === "Approved" ? "bg-green-100 text-green-800 border-2 border-green-200" :
                              "bg-red-100 text-red-800 border-2 border-red-200"
                            }`}>
                              {emp.status}
                            </span>
                          </div>

                          <div className="mb-8">
                            <p className="text-gray-700 text-xl leading-relaxed">
                              {expandedId === emp._id
                                ? emp.company_description
                                : emp.company_description?.slice(0, 180) + "..."}
                            </p>
                            {emp.company_description?.length > 180 && (
                              <button
                                onClick={() => setExpandedId(expandedId === emp._id ? null : emp._id)}
                                className="mt-4 text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors font-medium"
                              >
                                {expandedId === emp._id ? "Show Less" : "Read More"}
                              </button>
                            )}
                          </div>

                          <div className="flex gap-4 pt-8 border-t border-gray-100">
                            {emp.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(emp._id)}
                                  className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex-1"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(emp._id)}
                                  className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200 flex-1"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {emp.status === "Rejected" && (
                              <button
                                onClick={() => handleApprove(emp._id)}
                                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200 w-full"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Admin_Dashboard;
