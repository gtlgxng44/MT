
import React from 'react';
import { AppSection, User } from '../types';

interface NavbarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, currentUser, onLogout }) => {
  const navItems = [
    { 
      id: AppSection.BROWSE, 
      label: 'Market', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    { 
      id: AppSection.STREAM, 
      label: 'Stream', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v18l15-9y-15-9z"></path><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7l7 5-7 5z"/></svg>
    },
    { 
      id: AppSection.AI_MATCH, 
      label: 'A&R', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
    },
    { 
      id: AppSection.LYRIC_LAB, 
      label: 'Writer', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    },
  ];

  return (
    <>
      <nav className="hidden md:flex sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white italic group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
            GTL
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase italic">Records</span>
        </div>
        
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-[11px] font-black uppercase tracking-widest transition-all relative py-1 ${
                activeSection === item.id ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <button onClick={onLogout} className="text-[9px] text-zinc-500 hover:text-red-400 font-black uppercase tracking-[0.2em] border border-zinc-800 px-4 py-2 rounded-xl transition-colors">Sign Out</button>
          )}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-zinc-800/50 z-[120] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,16px)] pt-3 shadow-[0_-20px_40px_rgba(0,0,0,1)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 py-1 ${
              activeSection === item.id ? 'text-cyan-400' : 'text-zinc-600'
            }`}
          >
            <div className={`transition-all duration-300 ${activeSection === item.id ? 'scale-110' : 'scale-100 opacity-60'}`}>
              {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
