// src/pages/AdminJobs.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setJobData, updateJobStatus } from "../Redux/jobSlice";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { toast } from "react-toastify";
import axios from "axios";

const AdminJobs = () => {
  const [loading, setLoading] = useState(false);

  const { token, username, password } = useSelector((state) => state.auth);
  const jobData = useSelector((state) => state.jobs?.jobData) || [];
  const dispatch = useDispatch();

  const fetchJobs = async () => {
    if (!token) {
      toast.error("Session expired");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        "https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/jobs/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: JSON.stringify({ username, password }),
          },
        }
      );
      const jobs = res.data?.pendingJobs || [];
      dispatch(setJobData(Array.isArray(jobs) ? jobs : []));
    } catch (err) {
      console.error("FETCH JOBS ERROR:", err.response?.data || err);
      dispatch(setJobData([]));
    } finally {
      setLoading(false);
    }
  };

  const handleJobApprove = async (jobId) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/job/${jobId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}`, user: JSON.stringify({ username, password }) } }
      );
      dispatch(updateJobStatus({ jobId, status: "Approved" }));
      fetchJobs();
      toast.success("Job Approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error approving job");
    }
  };

  const handleJobReject = async (jobId) => {
    try {
      await axios.patch(
        `https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/job/${jobId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}`, user: JSON.stringify({ username, password }) } }
      );
      dispatch(updateJobStatus({ jobId, status: "Rejected" }));
      fetchJobs();
      toast.success("Job Rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token, username, password, dispatch]);

  const getJobActionButtons = (job) => {
    if (job.status === "Approved") {
      return (
        <button
          onClick={() => handleJobReject(job._id || job.job_id)}
          className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded border border-red-600"
          disabled={loading}
        >
          Move to Rejected
        </button>
      );
    } else if (job.status === "Rejected") {
      return (
        <button
          onClick={() => handleJobApprove(job._id || job.job_id)}
          className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded border border-blue-600"
          disabled={loading}
        >
          Approve
        </button>
      );
    } else {
      return (
        <>
          <button
            onClick={() => handleJobApprove(job._id || job.job_id)}
            className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded border border-blue-600"
            disabled={loading}
          >
            Approve Job
          </button>
          <button
            onClick={() => handleJobReject(job._id || job.job_id)}
            className="px-3 py-2 text-sm bg-white text-gray-700 rounded border border-blue-600 hover:bg-gray-50"
            disabled={loading}
          >
            Reject Job
          </button>
        </>
      );
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Fixed Navbar */}
        <AdminNavbar pageTitle="Employer Job Postings" />
        
        {/* Header Row with Refresh Button */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between sticky top-[80px] z-10">
          <h2 className="text-lg font-semibold text-gray-900">All Job Postings ( Pending / Rejected )</h2>
          <button
            className="text-sm text-blue-600 hover:text-blue-700 border border-blue-300 hover:bg-blue-50 rounded p-1.5"
            onClick={fetchJobs}
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
              {jobData.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No Jobs Found
                  </div>
                ) : (
                  jobData.map((job) => (
                  <div
                    key={job._id || job.job_id}
                    className="bg-white border border-slate-300 rounded shadow-sm p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Job Title
                        </label>
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Company
                        </label>
                        <p className="text-sm text-gray-900">{job.company_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Salary
                        </label>
                        <p className="text-sm text-gray-900">{job.salary_range}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Location
                        </label>
                        <p className="text-sm text-gray-900">{job.location}</p>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {job.required_skills?.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Job Type
                        </label>
                        <p className="text-sm text-gray-900">{job.job_type}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      {job.description && (
                        <div className="mb-4 pt-4">
                          <label className="text-xs font-semibold text-gray-600 block mb-2">
                            Description
                          </label>
                          <p className="text-sm text-gray-700">{job.description}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">
                            Status
                          </label>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${
                              job.status === "Approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : job.status === "Rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }`}
                          >
                            {job.status || "Pending"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Job ID</p>
                          <p className="text-xs font-medium text-gray-900">
                            {job.job_id?.slice(-8) || job._id?.slice(-8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        {getJobActionButtons(job)}
                      </div>
                    </div>

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

export default AdminJobs;
