import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Redux/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

function Admin_Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { username, password };
    console.log("%c[API Request: Login] Payload:", "color: #3b82f6;", payload);

    try {
      const res = await axios.post("https://skillbridge-backend-3-vqsm.onrender.com/api/admin-pannel/login", payload);
      console.log("%c[API Response: Login] Success:", "color: #10b981;", res.data);

      dispatch(setCredentials({ token: res.data.token, username, password }));
      toast.success("Login Successful");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("%c[API Response: Login] Failed:", "color: #ef4444;", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-gray-200">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Portal</h1>
          <p className="text-gray-600 font-medium">Sign in to manage SkillBridge</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Username</label>
            <input 
              className="w-full h-14 px-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-lg py-3"
              placeholder="Enter username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full h-14 pr-14 pl-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-lg py-3"
                placeholder="Enter password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full h-14 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center ${
              loading 
                ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            SkillBridge Admin © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin_Login;
