
import React, { useState, useEffect } from 'react';
import { ChatMessage, Beat } from '../types';
import { matchBeatsWithAI, isAiLive } from '../services/geminiService';

interface AIAssistantProps {
  beats: Beat[];
  onSuggestBeats: (ids: string[]) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ beats, onSuggestBeats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsDemo(!isAiLive());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setErrorStatus(null);

    try {
      const response = await matchBeatsWithAI(input, beats);
      
      const idMatch = response.match(/IDs:\s*\[?([\d\s,a-zA-Z0-9_-]+)\]?/);
      const suggestedIds = idMatch ? idMatch[1].split(',').map(id => id.trim()) : [];
      const cleanResponse = response.replace(/IDs:.*$/, '').replace(/\[GTL CORE\]/, '').trim();

      setMessages(prev => [...prev, { role: 'model', text: cleanResponse }]);
      if (suggestedIds.length > 0) onSuggestBeats(suggestedIds);
    } catch (err: any) {
      if (err.message === "AUTH_FAILED") {
        setErrorStatus("INVALID_KEY");
        setMessages(prev => [...prev, { role: 'model', text: "GTL Authentication Error: Your Gemini API Key is invalid or not alphanumeric. Please re-copy it from Google AI Studio and ensure no extra spaces." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. BYTEBEATZ44 servers might be busy. Using local vibe-match instead." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 backdrop-blur-xl rounded-[40px] border border-zinc-800 flex flex-col h-[650px] overflow-hidden shadow-2xl lg:sticky lg:top-24">
      <div className="p-6 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
            A&R Bot
            {isDemo && <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 not-italic">DEMO MODE</span>}
            {errorStatus === "INVALID_KEY" && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full not-italic">AUTH FAIL</span>}
          </h2>
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
            {isDemo ? 'Local Engine Active' : 'Powered by GTL Records AI'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${isDemo ? 'bg-zinc-800 border-zinc-700' : 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDemo ? "#52525b" : "#06b6d4"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 border shadow-xl transition-all ${isDemo ? 'bg-zinc-900 border-zinc-800' : 'bg-cyan-600/10 border-cyan-500/30 shadow-cyan-500/20'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDemo ? "#3f3f46" : "#06b6d4"} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 className="text-white font-black text-xl mb-2 uppercase italic tracking-tight">How can I help you?</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">I am the GTL head scout. Tell me your project name and vibe.</p>
            
            {(isDemo || errorStatus === "INVALID_KEY") && (
              <div className="mt-12 p-6 bg-zinc-950/80 border border-zinc-800 rounded-3xl max-w-xs border-dashed">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${errorStatus === "INVALID_KEY" ? 'text-red-400' : 'text-cyan-400'}`}>
                  {errorStatus === "INVALID_KEY" ? 'Key Fix Required' : 'Upgrade to Live AI'}
                </p>
                <p className="text-zinc-500 text-[9px] leading-relaxed font-bold">
                  {errorStatus === "INVALID_KEY" 
                    ? "The key in Netlify isn't alphanumeric. Re-copy from Google AI Studio and delete any trailing spaces." 
                    : "Add your API_KEY to Netlify to unlock real-time intelligence and voice analysis."}
                </p>
              </div>
            )}
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] p-5 rounded-[24px] text-sm font-bold leading-relaxed shadow-xl ${
              m.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-none' 
                : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 p-4 rounded-[24px] rounded-tl-none flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-zinc-950/80 border-t border-zinc-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Matching your sound..."
            className="flex-1 bg-black border border-zinc-800 text-white rounded-2xl px-5 py-5 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-bold placeholder:text-zinc-800"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-white text-black font-black px-8 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5 uppercase italic text-xs tracking-tighter"
          >
            Match
          </button>
        </div>
      </form>
    </div>
  );
};
