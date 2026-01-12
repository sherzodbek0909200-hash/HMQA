
import React from 'react';
import { ViewType } from '../types';

interface DashboardProps {
  onViewChange: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const actions = [
    { 
      id: ViewType.SOLVER, 
      title: 'Kazus Tahlili', 
      desc: 'Huquqiy masalalarni mantiqiy va qonuniy tahlil qilish yordamchisi.',
      icon: 'fa-scale-balanced',
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      id: ViewType.VALIDATOR, 
      title: 'Javob Tekshiruvi', 
      desc: 'O\'z yechimingizni qonun hujjatlariga muvofiqligini baholash.',
      icon: 'fa-file-shield',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: ViewType.CHAT, 
      title: 'Ziyo Chat', 
      desc: 'Intellektual suhbatdosh bilan har qanday mavzuda muloqot.',
      icon: 'fa-comments',
      color: 'from-indigo-500 to-purple-600'
    },
    { 
      id: ViewType.IMAGE, 
      title: 'Tasvir Studiyasi', 
      desc: 'Matn orqali yuqori sifatli tasvirlar yaratish.',
      icon: 'fa-palette',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: ViewType.SEARCH, 
      title: 'Aqlli Qidiruv', 
      desc: 'Internetdagi ma\'lumotlarni AI tahlili bilan qidirish.',
      icon: 'fa-magnifying-glass',
      color: 'from-emerald-500 to-blue-600'
    },
    { 
      id: ViewType.CREATOR, 
      title: 'To\'plam Yaratish', 
      desc: 'Xodimlar yoki talabalar uchun maxsus imtihon kazuslarini tayyorlash.',
      icon: 'fa-plus-circle',
      color: 'from-slate-600 to-blue-800'
    },
    { 
      id: ViewType.COLLECTIONS, 
      title: 'Topshiriqlar', 
      desc: 'Tayyorlangan topshiriqlarni kod orqali yuklash va yechish.',
      icon: 'fa-folder-tree',
      color: 'from-blue-700 to-blue-900'
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
              Akademiya tinglovchilari va xodimlari uchun ixtisoslashgan intellektual tahlil va monitoring tizimi.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800">
                  <i className="fa-solid fa-shield-check text-blue-500"></i>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Prokuratura nazorati</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800">
                  <i className="fa-solid fa-gavel text-blue-500"></i>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Sud-huquq islohotlari</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="pt-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-circle-arrow-right text-2xl"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[3rem] border-dashed border-2 border-slate-800">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">O'quv topshiriqlarini yuklash</h4>
              <p className="text-slate-500 italic">Akademiya tomonidan berilgan maxsus kod orqali imtihon kazuslarini oching.</p>
            </div>
            <button 
              onClick={() => onViewChange(ViewType.COLLECTIONS)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all border border-blue-400/20"
            >
              Topshiriqlarni ochish
            </button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
