
import React, { useState, useRef, useEffect } from 'react';
import { Beat } from '../types';

interface BeatStreamProps {
  beats: Beat[];
  onPlay: (beat: Beat) => void;
  currentBeat: Beat | null;
  isPlaying: boolean;
}

export const BeatStream: React.FC<BeatStreamProps> = ({ beats, onPlay, currentBeat, isPlaying }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
            onPlay(beats[index]);
          }
        });
      },
      { threshold: 0.7 }
    );

    const elements = containerRef.current?.querySelectorAll('.beat-snap-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [beats]);

  if (beats.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2"><path d="M5 3v18l15-9y-15-9z"/></svg>
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Vault is Sealed</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No beats available for streaming yet.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-140px)] overflow-y-scroll snap-y snap-mandatory custom-scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {beats.map((beat, index) => (
        <div 
          key={beat.id}
          data-index={index}
          className="beat-snap-card h-full w-full snap-start relative flex flex-col items-center justify-center p-6"
        >
          <div className="absolute inset-0 z-0">
             <img src={beat.coverUrl} className="w-full h-full object-cover blur-3xl opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          <div className="relative z-10 w-full max-w-sm aspect-square mb-8 group">
            <div className={`absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[40px] opacity-20 blur-2xl transition-all duration-1000 ${activeIndex === index && isPlaying ? 'scale-110 opacity-40' : 'scale-100 opacity-0'}`} />
            <img 
              src={beat.coverUrl} 
              className={`w-full h-full object-cover rounded-[40px] shadow-2xl transition-all duration-700 ${activeIndex === index ? 'scale-100 rotate-0' : 'scale-90 rotate-3 grayscale opacity-50'}`} 
            />
            {activeIndex === index && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex gap-1.5 items-end h-16">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-1.5 bg-white rounded-full animate-[visualizer_1s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 0.15}s`, height: `${20 + Math.random() * 80}%` }} />
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="relative z-10 text-center space-y-4">
             <div>
                <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">{beat.genre} • {beat.bpm} BPM</span>
                <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">{beat.title}</h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[11px] mt-1">BYTEBEATZ44 OFFICIAL</p>
             </div>
             
             <div className="flex gap-4 justify-center">
                <button className="bg-white text-black font-black px-8 py-3 rounded-2xl active:scale-95 transition-all text-sm uppercase italic shadow-xl shadow-white/5">
                  KSH {beat.price}
                </button>
                <button className="bg-zinc-900 text-white font-black px-8 py-3 rounded-2xl active:scale-95 transition-all text-sm uppercase italic border border-zinc-800">
                  License
                </button>
             </div>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes visualizer {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
