import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Library, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from "/src/assets/logo.svg"

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-[#000000] border-b border-zinc-800 text-zinc-100 h-16 px-6 sticky top-0 z-40 select-none">
      <div className="min-w-screen px-10 mx-auto h-full flex items-center justify-between">
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="header-logo"
        >
          <div className="rounded-lg flex items-center justify-center">
            <img src={logo} className="w-10 h-10 bg-[#ffffff] rounded-xl p-2" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-1">
            LearnTube 
            <span className="text-[10px] text-whitepx-1.5 py-0.2 rounded-lg py-0.5 px-1.5 border border-[#6e6e6e] font-medium font-mono">
            WORKSPACE</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <button
            id="nav-tab-dashboard"
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/dashboard') 
                ? 'bg-zinc-800 text-white shadow-inner' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          
          <button
            id="nav-tab-library"
            onClick={() => navigate('/videos')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/videos') 
                ? 'bg-zinc-800 text-white shadow-inner' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Library className="w-4 h-4" /> Video Library
          </button>
        </div>

        <div className="relative">
          <div 
            id="profile-dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-lg border-[#4d4d4d] border text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-600/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-zinc-100 truncate max-w-[100px] leading-tight">
                {user?.name || user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-zinc-500 truncate max-w-[100px] leading-none">
                {user?.email}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-450" />
          </div>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10 cursor-default" 
                onClick={() => setDropdownOpen(false)} 
              />
              
              <div 
                id="profile-dropdown"
                className="absolute right-0 mt-2 w-48 bg-[#0c0c0e] border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-20 flex flex-col gap-0.5 animate-fade-in"
              >
                <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Account Settings</p>
                </div>
                
                <button
                  id="dropdown-opt-profile"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors font-medium cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  My Profile
                </button>

                <button
                  id="dropdown-opt-settings"
                  onClick={() => {
                    setDropdownOpen(false);
                    alert("System Settings is coming soon!");  
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors font-medium cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                  System Settings
                </button>

                <div className="h-px bg-zinc-800 my-1" />

                <button
                  id="dropdown-opt-logout"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg text-left transition-colors w-full font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
