
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
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-400'
    },
    { 
      id: ViewType.VALIDATOR, 
      title: 'Javob Tekshiruvi', 
      desc: 'O\'z yechimingizni etalon javob bilan mantiqiy solishtirish.',
      icon: 'fa-file-shield',
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-400'
    },
    { 
      id: ViewType.COLLECTIONS, 
      title: 'Topshiriqlar', 
      desc: 'Sizga berilgan kod orqali imtihon kazuslarini yechish.',
      icon: 'fa-folder-tree',
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12 animate-fadeIn select-none relative">
      {/* Background Watermark Gerb */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/1024px-Emblem_of_Uzbekistan.svg.png" 
          alt="Watermark" 
          className="w-[600px] h-[600px] object-contain"
        />
      </div>

      <div className="relative p-12 rounded-[3.5rem] overflow-hidden border border-white/5 bg-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-amber-900/10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-40 h-40 md:w-52 md:h-52 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative p-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/1024px-Emblem_of_Uzbekistan.svg.png" 
              className="w-full h-full object-contain gold-glow brightness-110"
              alt="Emblem"
            />
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-pulse"></div>
          </div>
          
          <div className="text-center md:text-left space-y-6 flex-1">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                HMQ <span className="text-blue-500">AKADEMIYASI</span>
              </h1>
              <p className="text-amber-500 font-bold tracking-[0.3em] text-xs uppercase">
                O'zbekiston Respublikasi
              </p>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Tinglovchilarning bilim saviyasini monitoring qilish va tahlil qilishga mo'ljallangan yopiq idoraviy platforma.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {actions.map((action, i) => (
          <div 
            key={i} 
            onClick={() => onViewChange(action.id)}
            className="glass p-10 rounded-[3rem] group cursor-pointer hover:border-amber-500/30 hover:-translate-y-2 transition-all flex flex-col items-center text-center space-y-6 relative overflow-hidden shine-effect"
          >
            <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${action.color}`}></div>
            <div className={`w-20 h-20 rounded-[2rem] bg-slate-950 flex items-center justify-center ${action.iconColor} text-4xl group-hover:scale-110 transition-transform shadow-inner`}>
              <i className={`fa-solid ${action.icon}`}></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight uppercase">{action.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{action.desc}</p>
            </div>
            <div className="pt-2 text-amber-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
               <i className="fa-solid fa-arrow-right-long text-2xl"></i>
            </div>
          </div>
        ))}
      </div>

      <div 
        onClick={() => onViewChange(ViewType.CREATOR)}
        className="glass p-12 rounded-[3.5rem] border-dashed border-2 border-slate-800 hover:border-blue-500/40 cursor-pointer group transition-all flex flex-col md:flex-row items-center justify-between gap-8 shine-effect"
      >
        <div className="flex items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-blue-950/40 flex items-center justify-center text-blue-500 text-3xl group-hover:rotate-90 transition-transform border border-blue-500/20">
            <i className="fa-solid fa-plus-circle"></i>
          </div>
          <div>
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Yangi To'plam Yaratish</h4>
            <p className="text-slate-500 font-medium">Imtihon yoki o'quv mashg'ulotlari uchun maxsus kazuslar bazasini shakllantiring.</p>
          </div>
        </div>
        <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
          Boshlash
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
