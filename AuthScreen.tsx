
import React, { useState } from 'react';
import { User } from '../types';
import { registerUser, getUser } from '../services/storageService';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProducerMode, setIsProducerMode] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // SECURE ADMIN CREDENTIALS
  const ADMIN_EMAIL = 'GTLGXNG44@GMAIL.COM';
  const ADMIN_PASSCODE = 'GTL-PRO-2025';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isProducerMode) {
        // Master Logic (Hardcoded bypass + Supabase Sync)
        if (email.toUpperCase() !== ADMIN_EMAIL.toUpperCase()) {
          throw new Error('Unauthorized producer email.');
        }

        if (passcode !== ADMIN_PASSCODE) {
          throw new Error('Invalid Producer Passcode.');
        }
        
        const adminUser: User = {
          id: 'admin_master',
          username: 'BYTEBEATZ44',
          email: ADMIN_EMAIL,
          isAdmin: true
        };
        
        // Ensure admin profile exists in Supabase for metadata consistency
        await registerUser(adminUser);
        onAuthSuccess(adminUser);
        return;
      }

      // Standard Artist Entrance
      if (isRegistering) {
        if (!username.trim()) throw new Error("Stage name required.");
        
        const newUser: User = {
          id: `ARTIST_${Date.now()}`,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          isAdmin: false
        };
        await registerUser(newUser);
        onAuthSuccess(newUser);
      } else {
        // Login Flow
        const existingUser = await getUser(email.trim());
        if (existingUser) {
          onAuthSuccess(existingUser);
        } else {
          // If not found, intelligently suggest registration
          setError('Artist not found in vault. Sign up to enter.');
          setIsRegistering(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Supabase sync failed. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[28px] flex items-center justify-center font-bold text-3xl text-white italic mx-auto mb-6 shadow-2xl shadow-cyan-500/20">
            GTL
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Records Market</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            {isProducerMode ? 'Cloud Master Control' : 'Authorized Artist Entrance'}
          </p>
        </div>

        <div className={`bg-zinc-900/50 backdrop-blur-3xl border transition-all duration-500 p-8 rounded-[40px] shadow-2xl ${isProducerMode ? 'border-amber-500 shadow-amber-500/10' : 'border-zinc-800 shadow-cyan-500/5'}`}>
          {!isProducerMode && (
            <div className="flex bg-black p-1 rounded-2xl mb-8">
              <button 
                type="button"
                onClick={() => { setIsRegistering(false); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isRegistering ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Entrance
              </button>
              <button 
                type="button"
                onClick={() => { setIsRegistering(true); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isRegistering ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Join Market
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && !isProducerMode && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-black text-zinc-500 uppercase mb-2 ml-1 tracking-widest">Stage Name</label>
                <input 
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-zinc-700 font-bold"
                  placeholder="e.g. Young King"
                />
              </div>
            )}
            
            <div>
              <label className={`block text-xs font-black uppercase mb-2 ml-1 tracking-widest ${isProducerMode ? 'text-amber-500' : 'text-zinc-500'}`}>
                {isProducerMode ? 'Master Email' : 'Email Address'}
              </label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-black border rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-zinc-700 font-bold ${
                  isProducerMode ? 'border-amber-500/30 focus:ring-2 focus:ring-amber-500' : 'border-zinc-800 focus:ring-2 focus:ring-cyan-500'
                }`}
                placeholder={isProducerMode ? "GTLGXNG44@GMAIL.COM" : "artist@gtlrecords.com"}
              />
            </div>

            {isProducerMode && (
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                <label className="block text-xs font-black text-amber-500 uppercase mb-2 ml-1 tracking-widest">Master Passcode</label>
                <input 
                  required
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-black border border-amber-500/30 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono tracking-[0.5em]"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-[11px] text-center font-bold uppercase tracking-tight bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className={`w-full font-black text-lg py-5 rounded-2xl transition-all active:scale-95 shadow-xl mt-4 flex items-center justify-center gap-3 uppercase tracking-tighter ${
                isProducerMode 
                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20' 
                  : 'bg-white text-black hover:bg-cyan-500 hover:text-white shadow-cyan-500/10'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isProducerMode ? 'Init Control Room' : isRegistering ? 'Activate Artist Account' : 'Verify Entrance'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col items-center gap-4">
             <button 
              type="button"
              onClick={() => {
                setIsProducerMode(!isProducerMode);
                setIsRegistering(false);
                setError('');
                setEmail('');
                setPasscode('');
              }}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${
                isProducerMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-amber-500'
              }`}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
               {isProducerMode ? 'Artist Entrance' : 'PRODUCER LOGIN'}
             </button>
             <p className="text-center text-zinc-800 text-[9px] uppercase tracking-[0.3em] font-bold">
               GTL Records • Supabase Core v2.1
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
