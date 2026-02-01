
import React, { useState, useRef, useEffect } from 'react';
import { Beat } from '../types';
import { generateLyricHooks, speakLyrics, isAiLive } from '../services/geminiService';

interface LyricLabProps {
  beats: Beat[];
}

export const LyricLab: React.FC<LyricLabProps> = ({ beats }) => {
  const [selectedBeatId, setSelectedBeatId] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setIsDemo(!isAiLive());
  }, []);

  const selectedBeat = beats.find(b => b.id === selectedBeatId);

  const handleGenerate = async () => {
    if (!selectedBeat) return;
    setIsGenerating(true);
    setLyrics('');
    setErrorType(null);
    try {
      const result = await generateLyricHooks(selectedBeat.title, selectedBeat.description);
      setLyrics(result);
    } catch (err: any) {
      if (err.message === "AUTH_FAILED") {
        setErrorType("AUTH_FAILED");
        setLyrics("GTL Intelligence Error: Authentication Failed. Your API Key must be alphanumeric with no spaces. Re-verify in Netlify.");
      } else {
        setLyrics("Connection interrupted. Try refreshing the lab.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = async () => {
    if (!lyrics || isSpeaking || isDemo || errorType) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await speakLyrics(lyrics);
      if (!base64Audio) throw new Error("No audio returned");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioContextRef.current.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="mb-12 text-center lg:text-left">
        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
           <h1 className="text-5xl lg:text-7xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent italic leading-[0.9]">Lyric Lab</h1>
           {isDemo && <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black px-2 py-1 rounded border border-purple-500/20 uppercase tracking-widest">Demo</span>}
        </div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Ghostwriting Engine powered by GTL Core v2.4</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] shadow-2xl">
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-3 tracking-widest">Target Rhythm</label>
            <select 
              value={selectedBeatId}
              onChange={(e) => setSelectedBeatId(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer appearance-none font-black text-sm tracking-tight"
            >
              <option value="">Select a Beat...</option>
              {beats.map(b => (
                <option key={b.id} value={b.id}>{b.title} ({b.genre})</option>
              ))}
            </select>
          </div>

          <button 
            disabled={!selectedBeatId || isGenerating}
            onClick={handleGenerate}
            className="w-full bg-purple-600 hover:bg-white text-white hover:text-black font-black py-6 rounded-[32px] transition-all active:scale-95 shadow-2xl shadow-purple-600/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-tighter text-lg italic"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Ink Bars'
            )}
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] h-full min-h-[500px] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                Studio Session v2
              </span>
              <div className="flex gap-4">
                {lyrics && !isDemo && !errorType && (
                  <button 
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isSpeaking ? 'text-purple-400' : 'text-cyan-400 hover:text-white transition-colors'}`}
                  >
                    {isSpeaking ? 'Voicing...' : 'Hear Cadence'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                  <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Consulting the GTL Vault...</p>
                </div>
              ) : lyrics ? (
                <div className={`whitespace-pre-wrap font-medium leading-[1.8] italic font-serif ${isDemo || errorType ? 'text-zinc-500 text-sm opacity-60' : 'text-2xl text-white opacity-90'}`}>
                  {lyrics}
                  {(isDemo || errorType) && (
                    <div className="mt-12 p-8 bg-black/40 border border-zinc-800 rounded-3xl not-italic font-sans">
                      <p className={`font-black text-xs uppercase tracking-widest mb-2 ${errorType === "AUTH_FAILED" ? 'text-red-500' : 'text-purple-400'}`}>
                        {errorType === "AUTH_FAILED" ? 'AUTHENTICATION REJECTED' : 'DEMO MODE ACTIVE'}
                      </p>
                      <p className="text-zinc-500 text-xs leading-relaxed font-bold">
                        {errorType === "AUTH_FAILED" 
                          ? "Your key is invalid. Ensure the 'Value' in Netlify has no spaces and is alphanumeric. Key usually starts with 'AIzaSy'." 
                          : "Activate GTL Intelligence by adding your free Gemini API_KEY to Netlify."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-10">
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                   <p className="font-black uppercase tracking-tighter text-4xl">Mic Check 1-2</p>
                   <p className="text-xs font-bold uppercase tracking-[0.4em] mt-2">Select a beat to start the session</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
