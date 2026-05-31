import React from 'react';
import { 
  Compass, LayoutDashboard, UploadCloud, FileBarChart2, 
  Map, History, FileText, User, Settings, LogOut, ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: {
    username: string;
    email: string;
    role: 'archaeologist' | 'researcher' | 'student';
  };
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Image', icon: UploadCloud },
    { id: 'results', label: 'Analysis Results', icon: FileBarChart2 },
    { id: 'map', label: 'Coastal Map', icon: Map },
    { id: 'history', label: 'Historical Analysis', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'archaeologist': return 'bg-amber-500/10 text-amber-700 border-amber-200/50';
      case 'researcher': return 'bg-ocean/10 text-ocean border-ocean/20';
      default: return 'bg-seagreen/10 text-seagreen border-seagreen/20';
    }
  };

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full text-slate-300">
      {/* Brand logo container */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-ocean text-white p-2.5 rounded-xl shadow-md">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            CoastalVision <span className="font-light text-slate-400">AI</span>
          </span>
          <p className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Geospatial platform</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-grow p-4 mt-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-gradient-to-r from-ocean to-ocean-light text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Current User block */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean/50 to-seagreen/50 flex items-center justify-center font-display font-bold text-white text-sm shadow-inner border border-white/10 uppercase">
            {currentUser.username.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{currentUser.username}</h4>
            <p className="text-[10px] text-slate-500 truncate mb-1">{currentUser.email}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold border ${getRoleBadgeColor(currentUser.role)} uppercase tracking-wider`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Logout action */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 border border-transparent hover:border-rose-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
}
