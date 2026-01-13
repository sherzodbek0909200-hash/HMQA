
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import CaseValidator from './components/CaseValidator';
import CaseCollections from './components/CaseCollections';
import CaseCreator from './components/CaseCreator';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import LibraryView from './components/LibraryView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); 
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} />;
      case ViewType.VALIDATOR:
        return <CaseValidator />;
      case ViewType.COLLECTIONS:
        return <CaseCollections />;
      case ViewType.CREATOR:
        return <CaseCreator onCreated={() => setCurrentView(ViewType.COLLECTIONS)} />;
      case ViewType.ADMIN:
        return <AdminView />;
      case ViewType.LIBRARY:
        return <LibraryView />;
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
              <p className="text-blue-400 font-bold tracking-widest text-[10px] md:text-xs uppercase opacity-80">
                Lokal Tahlil Platformasi
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950 p-4 md:p-8 overflow-y-auto scrollbar-hide">
           {renderView()}
        </main>
      </div>
    </>
  );
};

export default App;
