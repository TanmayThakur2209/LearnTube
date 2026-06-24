import { useNavigate } from 'react-router-dom';
import { Mail, Calendar, Shield, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    videos: 0,
    joined_at: "",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await authService.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  
  const joinedDate = stats.joined_at
    ? new Date(stats.joined_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-8 text-left">
        <button
          id="profile-lnk-back"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Study Profile</h1>
          <p className="text-slate-400 text-xs">Manage your interactive video coordinates and student statistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 bg-[#000000] border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-black font-bold flex items-center justify-center text-3xl shadow-lg shadow-indigo-600/10">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white leading-none">
                  {user?.name || user?.email?.split('@')[0]}
                </h3>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] font-mono">Academic ID</p>
                <p className="font-semibold text-slate-200">{user?.id || 'usr-demo-1'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] font-mono">Account Creation</p>
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-white" /> {joinedDate}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] font-mono">Enrolled Track</p>
                <div className="inline-flex items-center gap-1 border border-[#3f3f3f] text-white px-2.5 py-0.5 rounded-full font-medium">
                  <Shield className="w-3 h-3" /> Master License
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] font-mono">Status Level</p>
                <span className="font-semibold text-emerald-400">Honors Active</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4">
            <div className="bg-[#000000] border border-slate-800/80 p-5 rounded-2xl space-y-2 text-left">
              <div className="p-2.5 bg-black border border-indigo-500/20 rounded-xl inline-block text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white">{stats.videos}</p>
              <h4 className="font-bold text-xs text-slate-300">Lectures Processed</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Algorithms, LLMs, and research papers index files completely processed.</p>
            </div>

            <div className="bg-[#000000] border border-slate-800/80 p-5 rounded-2xl space-y-2 text-left">
              <div className="p-2.5  border border-indigo-500/20 rounded-xl inline-block text-white">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-white">12</p>
              <h4 className="font-bold text-xs text-slate-300">Estimated Study Saved</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Derived from skipping transcript pauses and matching direct citation anchors.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
