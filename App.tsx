import React, { useState, useMemo, useEffect } from 'react';
import { AppSection, Beat, User } from './types';
import { Navbar } from './components/Navbar.tsx';
import { BeatCard } from './components/BeatCard.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { AIAssistant } from './components/AIAssistant.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { AddBeatModal } from './components/AddBeatModal.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { LyricLab } from './components/LyricLab.tsx';
import { BeatStream } from './components/BeatStream.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { subscribeToBeats, saveBeat, deleteBeat as deleteBeatFromStorage } from './services/storageService';

const AUTH_STORAGE_KEY = 'gtl_current_artist_supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [beats, setBeats] = useState<Beat[]>([]);
  const [isLoadingBeats, setIsLoadingBeats] = useState(true);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.BROWSE);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [suggestedBeatIds, setSuggestedBeatIds] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Checkout State
  const [checkoutData, setCheckoutData] = useState<{ beat: Beat; license: string; price: number } | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (currentUser) {
      setIsLoadingBeats(true);
      cleanup = subscribeToBeats((realTimeBeats) => {
        setBeats(realTimeBeats);
        setIsLoadingBeats(false);
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [currentUser]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentBeat(null);
    setIsPlaying(false);
  };

  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [sortBy, setSortBy] = useState('newest');

  const genres = useMemo(() => {
    const set = new Set(beats.map(b => b.genre));
    return Array.from(set);
  }, [beats]);

  const handlePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(true);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const handleAddBeat = async (newBeat: Beat, audioBlob?: Blob, coverBlob?: Blob) => {
    try {
      await saveBeat(newBeat, audioBlob, coverBlob);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBeat = async (id: string) => {
    try {
      await deleteBeatFromStorage(id);
      if (currentBeat?.id === id) {
        setCurrentBeat(null);
        setIsPlaying(false);
      }
    } catch (err) {
      alert("Failed to delete track.");
    }
  };

  const filteredAndSortedBrowseBeats = useMemo(() => {
    let result = [...beats];
    if (searchText) {
      const lowSearch = searchText.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(lowSearch) || 
        b.producer.toLowerCase().includes(lowSearch)
      );
    }
    if (selectedGenre !== 'All Genres') {
      result = result.filter(b => b.genre === selectedGenre);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'bpm-low': return a.bpm - b.bpm;
        case 'bpm-high': return b.bpm - a.bpm;
        default: return 0;
      }
    });
    return result;
  }, [beats, searchText, selectedGenre, sortBy]);

  const filteredAIBeats = suggestedBeatIds.length > 0 
    ? beats.filter(b => suggestedBeatIds.includes(b.id)) 
    : beats;

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-40 overflow-x-hidden">
      {(activeSection === AppSection.BROWSE || activeSection === AppSection.AI_MATCH) && (
        <div className="bg-cyan-600/10 border-b border-cyan-500/20 py-2 overflow-hidden relative z-[60]">
          <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap items-center gap-12">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                GTL RECORDS PRODUCTION • BYTEBEATZ44 OFFICIAL CATALOG • SUPABASE REALTIME ENABLED
              </span>
            ))}
          </div>
        </div>
      )}

      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className={`${activeSection === AppSection.STREAM ? 'max-w-full px-0 py-0' : 'max-w-7xl mx-auto px-6 py-12'} relative z-10 transition-all duration-500`}>
        <div className="animate-in fade-in duration-1000">
          {activeSection === AppSection.BROWSE && (
            <section>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl ${
                      currentUser.isAdmin ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-cyan-500 text-black shadow-cyan-500/20'
                    }`}>
                      {currentUser.isAdmin ? 'Cloud Producer Control' : 'Authorized Artist Access'}
                    </span>
                  </div>
                  <h1 className="text-6xl lg:text-9xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-zinc-700 bg-clip-text text-transparent italic leading-[0.9]">
                    {beats.length > 0 ? 'Market' : 'Empty'}
                  </h1>
                </div>
                {currentUser.isAdmin && (
                  <button onClick={() => setIsUploadModalOpen(true)} className="bg-cyan-500 text-black font-black px-12 py-6 rounded-3xl flex items-center gap-3 hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-cyan-500/30 group">
                    <svg className="group-hover:rotate-90 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Drop
                  </button>
                )}
              </div>

              {beats.length > 0 && (
                <FilterBar 
                  searchText={searchText} setSearchText={setSearchText}
                  selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
                  sortBy={sortBy} setSortBy={setSortBy} genres={genres}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoadingBeats ? (
                  <div className="col-span-full py-40 text-center flex flex-col items-center">
                    <div className="w-16 h-16 border-[6px] border-zinc-900 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing Cloud Vault...</p>
                  </div>
                ) : filteredAndSortedBrowseBeats.length > 0 ? (
                  filteredAndSortedBrowseBeats.map((beat) => (
                    <BeatCard 
                      key={beat.id} beat={beat} onPlay={handlePlay} 
                      isPlaying={isPlaying && currentBeat?.id === beat.id} 
                      currentUser={currentUser} onDelete={handleDeleteBeat}
                      onCheckout={(beat, license, price) => setCheckoutData({ beat, license, price })}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-800 rounded-[64px] flex flex-col items-center justify-center bg-zinc-900/5 hover:bg-zinc-900/10 transition-all">
                    <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">No Tracks Found</h3>
                    <p className="text-zinc-500 max-w-sm mb-8 font-bold uppercase tracking-widest text-[10px]">Adjust filters or contact BYTEBEATZ44 for custom production.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeSection === AppSection.STREAM && (
            <BeatStream beats={beats} onPlay={handlePlay} currentBeat={currentBeat} isPlaying={isPlaying} />
          )}

          {activeSection === AppSection.AI_MATCH && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                 <AIAssistant beats={beats} onSuggestBeats={(ids) => setSuggestedBeatIds(ids)} />
                 <div className="space-y-8">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic border-b-2 border-cyan-500 w-fit pr-8 pb-2">AI Match Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredAIBeats.length > 0 ? filteredAIBeats.map((beat) => (
                        <BeatCard key={beat.id} beat={beat} onPlay={handlePlay} isPlaying={isPlaying && currentBeat?.id === beat.id} currentUser={currentUser} onCheckout={(beat, license, price) => setCheckoutData({ beat, license, price })} />
                      )) : (
                        <div className="col-span-full p-12 bg-zinc-900/40 rounded-[32px] border border-zinc-800 text-center">
                           <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Speak to the A&R bot to discover hidden tracks.</p>
                        </div>
                      )}
                    </div>
                 </div>
               </div>
            </section>
          )}

          {activeSection === AppSection.LYRIC_LAB && (
            <div className="px-4">
              <LyricLab beats={beats} />
            </div>
          )}
        </div>
      </main>

      {activeSection !== AppSection.STREAM && (
        <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black/90 border-t border-zinc-900 flex items-center px-6 justify-between text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 z-[110] pointer-events-none">
          <div className="flex items-center gap-4">
            <span>GTL RECORDS GLOBAL</span>
            <span className="text-cyan-900">v3.0_PROD</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500/20 rounded-full"></span> SYSTEM NOMINAL</span>
            <span className="text-zinc-800 uppercase tracking-widest font-black">COPYRIGHT 2026 GTL RECORDS 44</span>
          </div>
        </footer>
      )}

      <AddBeatModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onAdd={handleAddBeat} />
      <CheckoutModal 
        isOpen={!!checkoutData} 
        onClose={() => setCheckoutData(null)}
        beat={checkoutData?.beat || null}
        licenseType={checkoutData?.license || ''}
        price={checkoutData?.price || 0}
        currentUser={currentUser}
      />
      <AudioPlayer currentBeat={currentBeat} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;