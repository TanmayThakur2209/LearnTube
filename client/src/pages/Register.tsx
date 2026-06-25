import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from "/src/assets/logo.svg"

export default function Register() {
  const navigate = useNavigate();
  const { register, token, user } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (token || user) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      await register(email, password, name);

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      setErrorMsg(
        err?.response?.data?.detail ||
        err?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-505/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative"
      >
        <div className="flex flex-col items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/10">
            <img src={logo} className="w-13 h-13 bg-[#ffffff] rounded-xl p-2" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            LearnTube <span className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/20 font-medium font-mono">AI</span>
          </h2>
          <p className="text-slate-400 text-xs text-center mt-1">Create an account to track interactive summaries</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-900/40 text-red-300 rounded-lg text-xs flex gap-2 items-start animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs text-slate-400 font-medium tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="reg-name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Student"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600/80 transition-colors"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs text-slate-400 font-medium tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="reg-email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600/80 transition-colors"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs text-slate-400 font-medium tracking-wide">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="reg-pass"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600/80 transition-colors"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs text-slate-400 font-medium tracking-wide">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="reg-confirm"
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600/80 transition-colors"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button 
            id="btn-register-submit"
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/10 mt-3"
          >
            {loading ? 'Registering Account...' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline-offset-4 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
