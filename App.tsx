
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import CaseSolver from './components/CaseSolver';
import CaseValidator from './components/CaseValidator';
import CaseCollections from './components/CaseCollections';
import CaseCreator from './components/CaseCreator';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import SearchView from './components/SearchView';
import AdminView from './components/AdminView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} />;
      case ViewType.SOLVER:
        return <CaseSolver />;
      case ViewType.VALIDATOR:
        return <CaseValidator />;
      case ViewType.CHAT:
        return <ChatView />;
      case ViewType.IMAGE:
        return <ImageView />;
      case ViewType.SEARCH:
        return <SearchView />;
      case ViewType.COLLECTIONS:
        return <CaseCollections />;
      case ViewType.CREATOR:
        return <CaseCreator onCreated={() => setCurrentView(ViewType.COLLECTIONS)} />;
      case ViewType.ADMIN:
        return <AdminView />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <>
      {showSplash && (
        <div className="splash-overlay select-none">
          <div className="flex flex-col items-center gap-10">
            <div className="emblem-main relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
              <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center relative z-10">
                <img 
                  src="https://proacademy.uz/assets/images/logo.png" 
                  alt="Academy Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<i class="fa-solid fa-shield-halved text-8xl text-blue-400"></i>';
                  }}
                />
              </div>
            </div>
            <div className="text-center space-y-3 z-10">
              <h1 className="academy-title text-2xl md:text-4xl font-black uppercase tracking-[0.15em] leading-tight max-w-2xl px-6 text-center">
                Huquqni muhofaza qilish akademiyasi
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto opacity-50"></div>
              <p className="text-blue-400 font-bold tracking-widest text-[10px] md:text-xs uppercase opacity-80">
                Sun'iy Intellekt Tahlil Platformasi
              </p>
            </div>
          </div>
          <div className="absolute bottom-12 flex flex-col items-center gap-4">
             <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-bounce [animation-delay:-0.3s]"></div>
             </div>
             <span className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.3em]">Xavfsiz yuklanmoqda</span>
          </div>
        </div>
      )}
      <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
            {renderView()}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
