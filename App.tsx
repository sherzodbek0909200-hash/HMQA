
import React, { useState, useEffect } from 'react';
import { ViewType } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import CaseValidator from './components/CaseValidator.tsx';
import CaseCollections from './components/CaseCollections.tsx';
import CaseCreator from './components/CaseCreator.tsx';
import Dashboard from './components/Dashboard.tsx';
import AdminView from './components/AdminView.tsx';
import LibraryView from './components/LibraryView.tsx';
import ChatView from './components/ChatView.tsx';
import ImageView from './components/ImageView.tsx';
import SearchView from './components/SearchView.tsx';
import CaseSolver from './components/CaseSolver.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); 
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
      case ViewType.CHAT:
        return <ChatView />;
      case ViewType.IMAGE:
        return <ImageView />;
      case ViewType.SEARCH:
        return <SearchView />;
      case ViewType.SOLVER:
        return <CaseSolver />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <>
      {showSplash && (
        <div className="splash-overlay select-none overflow-hidden animate-fadeIn">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full"></div>
          <div className="relative flex flex-col items-center gap-12">
            <div className="relative">
              <div className="absolute -inset-8 loading-ring opacity-30"></div>
              <div className="gerb-anim relative z-10">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/1024px-Emblem_of_Uzbekistan.svg.png" 
                  alt="Uzbekistan Emblem" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain gold-glow"
                />
              </div>
            </div>
            <div className="text-center space-y-6 z-10">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] leading-tight text-white">
                  O'ZBEKISTON RESPUBLIKASI
                </h1>
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-[0.1em] text-blue-400">
                  Huquqni muhofaza qilish akademiyasi
                </h2>
              </div>
            </div>
          </div>
          <div className="absolute bottom-16 flex flex-col items-center gap-6">
             <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150"></div>
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-300"></div>
             </div>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-[#020617] overflow-hidden text-slate-200">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 flex flex-col relative overflow-hidden p-4 md:p-8 overflow-y-auto scrollbar-hide">
           <div className="fixed top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
           <div className="fixed bottom-0 left-0 w-64 h-64 bg-amber-600/5 blur-[100px] pointer-events-none"></div>
           <div className="relative z-10">
            {renderView()}
           </div>
        </main>
      </div>
    </>
  );
};

export default App;
