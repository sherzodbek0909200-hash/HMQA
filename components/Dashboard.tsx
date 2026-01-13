
import React from 'react';
import { ViewType } from '../types';

interface DashboardProps {
  onViewChange: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const actions = [
    { 
      id: ViewType.LIBRARY, 
      title: 'Bilimlar Bazasi', 
      desc: 'Huquqiy terminlar, kodekslar va qonunchilik asoslari to\'plami.',
      icon: 'fa-book-bookmark',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: ViewType.VALIDATOR, 
      title: 'Javob Tekshiruvi', 
      desc: 'O\'z yechimingizni etalon javob bilan mantiqiy solishtirish.',
      icon: 'fa-file-shield',
      color: 'from-indigo-600 to-blue-600'
    },
    { 
      id: ViewType.COLLECTIONS, 
      title: 'Topshiriqlar', 
      desc: 'Sizga berilgan kod orqali imtihon kazuslarini yechish.',
      icon: 'fa-folder-tree',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12 animate-fadeIn select-none">
      <div className="relative p-10 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-blue-900/10 rounded-full flex items-center justify-center border-4 border-blue-500/10 relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <i className="fa-solid fa-building-columns text-6xl md:text-8xl text-blue-500/30"></i>
          </div>
          <div className="text-center md:text-left space-y-4 flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
              HUQUQNI MUHOFAZA QILISH <span className="text-blue-500">AKADEMIYASI</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              O'quv jarayonini monitoring qilish va huquqiy bilimlarni mustahkamlash uchun mo'ljallangan yopiq platforma.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <div 
            key={i} 
            onClick={() => onViewChange(action.id)}
            className="glass p-8 rounded-[2.5rem] group cursor-pointer hover:border-blue-500/40 hover:-translate-y-1 transition-all flex flex-col items-center text-center space-y-4 relative overflow-hidden"
          >
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${action.color}`}></div>
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 text-3xl group-hover:scale-110 transition-transform">
              <i className={`fa-solid ${action.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-white leading-tight">{action.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{action.desc}</p>
          </div>
        ))}
      </div>

      <div 
        onClick={() => onViewChange(ViewType.CREATOR)}
        className="glass p-10 rounded-[3rem] border-dashed border-2 border-slate-800 hover:border-blue-500/50 cursor-pointer group transition-all flex items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-plus-circle"></i>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white">To'plam Yaratish</h4>
          <p className="text-slate-500">Yangi o'quv va imtihon kazuslarini tayyorlang (Admin/O'qituvchilar uchun).</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
