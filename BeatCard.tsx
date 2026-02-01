
import React, { useState } from 'react';
import { Beat, User } from '../types';

interface BeatCardProps {
  beat: Beat;
  onPlay: (beat: Beat) => void;
  isPlaying: boolean;
  currentUser?: User | null;
  onDelete?: (id: string) => void;
  onCheckout?: (beat: Beat, license: string, price: number) => void;
}

export const BeatCard: React.FC<BeatCardProps> = ({ beat, onPlay, isPlaying, currentUser, onDelete, onCheckout }) => {
  const [license, setLicense] = useState('Basic');

  const getTierPrice = () => {
    switch(license) {
      case 'Pro': return beat.price * 2.5;
      case 'Unlimited': return beat.price * 5;
      default: return beat.price;
    }
  };

  const handleBuy = () => {
    if (currentUser?.isAdmin) return;
    onCheckout?.(beat, license, getTierPrice());
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-[24px] overflow-hidden group hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={beat.coverUrl} 
          alt={beat.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {beat.isHot && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter animate-pulse shadow-lg shadow-red-500/40">
              🔥 Best Seller
            </span>
          )}
          {beat.isTrending && (
            <span className="bg-cyan-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-cyan-500/40">
              ⚡ Trending
            </span>
          )}
        </div>

        {currentUser?.isAdmin && (
           <button 
            onClick={(e) => {
              e.stopPropagation();
              if(window.confirm('Delete this beat from the market?')) onDelete?.(beat.id);
            }}
            className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
           </button>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px] z-10">
          <button 
            onClick={() => onPlay(beat)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black transform hover:scale-110 transition-transform shadow-2xl"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <span className="text-white font-bold text-xs uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10">
            Preview Track
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-lg text-white truncate group-hover:text-cyan-400 transition-colors">{beat.title}</h3>
          <div className="flex flex-col items-end">
             <span className="text-white font-black text-lg leading-none transition-all">KSH {getTierPrice().toLocaleString()}</span>
             <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Price / {license}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-zinc-500 text-xs font-bold">BYTEBEATZ44</span>
          <svg className="w-3 h-3 text-cyan-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-xl mb-4 border border-zinc-800">
          {['Basic', 'Pro', 'Unlimited'].map((type) => (
            <button
              key={type}
              onClick={() => setLicense(type)}
              className={`text-[9px] font-black uppercase py-1.5 rounded-lg transition-all ${
                license === type ? 'bg-zinc-800 text-cyan-400 shadow-inner' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button 
          onClick={handleBuy}
          className={`w-full font-black py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mb-4 h-12 ${
          currentUser?.isAdmin 
            ? 'bg-zinc-800 text-zinc-400 cursor-default opacity-50' 
            : 'bg-white text-black hover:bg-cyan-500 hover:text-white shadow-lg hover:shadow-cyan-500/20'
        }`}>
          {currentUser?.isAdmin ? (
            'Management View'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Get License
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold border-t border-zinc-800/50 pt-4 uppercase tracking-tighter">
          <span>{beat.genre}</span>
          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{beat.bpm} BPM</span>
        </div>
      </div>
    </div>
  );
};
