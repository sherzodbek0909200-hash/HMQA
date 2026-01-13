
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, icon: 'fa-house', label: 'Bosh Sahifa' },
    { id: ViewType.LIBRARY, icon: 'fa-book-bookmark', label: 'Bilimlar Bazasi' },
    { id: ViewType.VALIDATOR, icon: 'fa-file-shield', label: 'Javob Tekshiruvi' },
    { id: ViewType.CREATOR, icon: 'fa-plus-circle', label: 'To\'plam Yaratish' },
    { id: ViewType.COLLECTIONS, icon: 'fa-folder-tree', label: 'Topshiriqlar' },
  ];

  return (
    <aside className="w-20 md:w-64 border-r border-slate-800 flex flex-col glass z-40 select-none">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
          <i className="fa-solid fa-building-columns text-white text-lg"></i>
        </div>
        <div className="hidden md:block overflow-hidden">
          <span className="block font-black text-[11px] leading-tight text-white uppercase tracking-tighter">HMQ Akademiyasi</span>
          <span className="block text-[8px] text-blue-400 font-bold uppercase tracking-widest opacity-70">Platforma</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${
              currentView === item.id 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-600/5' 
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center text-lg ${currentView === item.id ? 'text-blue-400' : 'group-hover:text-blue-400'}`}></i>
            <span className="hidden md:block font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button
          onClick={() => onNavigate(ViewType.ADMIN)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all mb-4 ${
            currentView === ViewType.ADMIN ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-amber-400'
          }`}
        >
          <i className="fa-solid fa-user-tie w-6 text-center text-lg"></i>
          <span className="hidden md:block font-bold text-sm uppercase tracking-tighter">Admin Panel</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
