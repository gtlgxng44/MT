
import React, { useRef, useEffect, useState } from 'react';
import { Beat } from '../types';

interface AudioPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentBeat, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBeat]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-white/5 p-4 z-[100] animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      <div className="max-w-7xl mx-auto flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-4 w-1/4 min-w-[120px]">
          <div className="relative flex-shrink-0">
            <img src={currentBeat.coverUrl} className={`w-12 h-12 rounded-lg object-cover shadow-2xl transition-all duration-500 ${isPlaying ? 'scale-105 shadow-cyan-500/20' : 'scale-100 opacity-60'}`} />
          </div>
          <div className="min-w-0 hidden sm:block">
            <h4 className="text-white font-black truncate text-xs">{currentBeat.title}</h4>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[10px] truncate font-bold uppercase tracking-tighter">BYTEBEATZ44</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-90 transition-all shadow-xl"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
          
          <div className="w-full max-w-2xl group flex flex-col gap-1 px-2">
             <div className="relative w-full bg-zinc-800/50 h-1 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cyan-500 h-full transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
             </div>
          </div>
        </div>

        <div className="flex w-1/4 justify-end items-center">
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest border border-white/10">
            LICENSE
          </button>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={currentBeat.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
