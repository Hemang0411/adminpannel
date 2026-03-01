import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPendingData, updateEmployerStatus } from "../Redux/employerSlice";
import { setJobData, updateJobStatus } from "../Redux/jobSlice";
import { logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Admin_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Job Posting");
  const [subTab, setSubTab] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const { token, username, password } = useSelector((state) => state.auth);
  const pendingData = useSelector((state) => state.employers?.pendingData) || [];
  const jobData = useSelector((state) => state.jobs?.jobData) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchEmployers = async () => {
    console.log(token,username,password)
  if (!token) {
    toast.error("Session expired. Please login again.");
    navigate("/");
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
    console.log(res.data.pendingEmployers)
    let employerList = res.data?.data || res.data?.employers || res.data.pendingEmployers || [];
    employerList = Array.isArray(employerList) ? employerList : [];
    
    employerList = employerList.map(emp => ({
      ...emp,
      status: emp.status || 'Pending' 
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

  const fetchJobs = async () => {
    if (!token) {
      toast.error("Session expired");
      navigate("/");
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
  if (activeTab === "Employer Registration") {
    fetchEmployers();
  } else {
    fetchJobs();
  }
}, [activeTab, token, username, password, dispatch, navigate]);

  // ✅ FILTERING FOR JOBS (Pending/Approved/Rejected)
  const filteredJobs = jobData.filter((job) => 
    (job.status?.toLowerCase() || 'pending') === subTab.toLowerCase()
  );

  // Employer filtering
  const filteredEmployers = pendingData.filter((emp) => 
  (emp.status?.toLowerCase() || 'pending') === subTab.toLowerCase()
);

  // Get action buttons based on status
  const getJobActionButtons = (job) => {
    if (job.status === "Approved") {
      return (
        <button
          onClick={() => handleJobReject(job._id || job.job_id)}
          className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all duration-200"
        >
          Move to Rejected
        </button>
      );
    } else if (job.status === "Rejected") {
      return (
        <button
          onClick={() => handleJobApprove(job._id || job.job_id)}
          className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-all duration-200"
        >
          Approve
        </button>
      );
    } else {
      return (
        <>
          <button
            onClick={() => handleJobApprove(job._id || job.job_id)}
            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-all duration-200"
          >
            Approve Job
          </button>
          <button
            onClick={() => handleJobReject(job._id || job.job_id)}
            className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all duration-200"
          >
            Reject Job
          </button>
        </>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-40">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">SkillBridge Admin</p>
        </div>
        <nav className="mt-10 px-4 space-y-1">
          {["Job Posting", "Employer Registration"].map((name) => (
            <button
              key={name}
              onClick={() => {
                setActiveTab(name);
                setSubTab("Pending");
              }}
              className={`w-full text-left px-6 py-4 rounded-xl ${
                activeTab === name
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-800 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
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
            className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="ml-64 flex-1 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-12 pt-8 pb-6 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">{activeTab}</h1>
        </header>

        <main className="px-12 py-8">
          <div className="flex space-x-3 mb-8">
            {["Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold ${
                  subTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 bg-white border border-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-16 text-gray-500 text-xl">Loading...</div>
          )}

          {/* Job Posting - NOW WITH FILTERING */}
          {activeTab === "Job Posting" && !loading && (
            <div className="space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-xl">
                  No {subTab} Jobs Found
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id || job.job_id} className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Job Title</label>
                        <p className="text-xl font-bold text-gray-900">{job.title}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Company</label>
                        <p className="text-lg text-gray-900">{job.company_name}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Salary</label>
                        <p className="text-lg font-semibold text-gray-900">{job.salary_range}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Location</label>
                        <p className="text-lg text-gray-900">{job.location}</p>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills?.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Job Type</label>
                        <p className="text-lg text-gray-900">{job.job_type}</p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            job.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            job.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status || 'Pending'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Job ID</p>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {job.job_id?.slice(-8) || job._id?.slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* ✅ DYNAMIC ACTION BUTTONS FOR ALL TABS */}
                      <div className="flex gap-4">
                        {getJobActionButtons(job)}
                      </div>
                    </div>

                    {job.description && (
                      <div className="mt-6 pt-6 border-t">
                        <label className="text-sm font-semibold text-gray-700 block mb-3">Description</label>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Employer Registration */}
          {activeTab === "Employer Registration" && !loading && (
            <div className="space-y-6">
              {filteredEmployers.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-xl">
                  No {subTab} Employers Found
                </div>
              ) : (
                filteredEmployers.map((emp) => (
                  <div key={emp._id} className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">{emp.company_name}</h2>
                    <p className="text-gray-600 text-lg mt-1">{emp.full_name}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        emp.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        emp.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {emp.status || 'Pending'}
                      </span>
                    </div>
                    {emp.status === "Pending" && (
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => handleApprove(emp._id)}
                          className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(emp._id)}
                          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold"
                        >
                          Reject
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

export default Admin_Dashboard;
