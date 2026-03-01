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
      navigate("/admin-home");
    } catch (err) {
      console.error("%c[API Response: Login] Failed:", "color: #ef4444;", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/10 via-slate-800/5 to-slate-900/10 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-xl p-5 sm:p-7">
        <div className="text-center mb-7">
          <div className="w-11 h-11 bg-white/70 rounded-lg flex items-center justify-center mx-auto mb-3.5 border border-slate-200/60 shadow-sm">
            <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">Admin Portal</h1>
          <p className="text-slate-600 font-medium text-xs sm:text-sm">Sign in to manage SkillBridge</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight">Username</label>
            <input 
              className="w-full h-9.5 px-2.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none transition-all duration-200 text-sm placeholder-slate-400 hover:border-slate-300"
              placeholder="Enter username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full h-9.5 pr-9 pl-2.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none transition-all duration-200 text-sm placeholder-slate-400 hover:border-slate-300"
                placeholder="Enter password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 transition-all duration-200 hover:scale-110"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full h-9.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md active:shadow-sm ${
              loading 
                ? "bg-slate-300 cursor-not-allowed text-slate-400 border border-slate-200" 
                : "bg-slate-900 hover:bg-slate-800 text-white border-2 border-transparent hover:border-slate-700/50"
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-7 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            SkillBridge Admin © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin_Login;
