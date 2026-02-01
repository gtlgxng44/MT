
import React, { useState } from 'react';
import { Beat, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: Beat | null;
  licenseType: string;
  price: number;
  currentUser: User | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, beat, licenseType, price, currentUser }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [countdown, setCountdown] = useState(15);

  if (!isOpen || !beat) return null;

  const handleSTKPush = () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid M-Pesa number (e.g., 0712345678)");
      return;
    }
    
    setStatus('processing');
    
    // Simulate STK Push Waiting Time
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWhatsAppPay = () => {
    // Official GTL Records / BYTEBEATZ44 WhatsApp Number
    const waNumber = "254105076414";
    const message = `Hi BYTEBEATZ44, I'm purchasing "${beat.title}" (${licenseType} License) for KSH ${price.toLocaleString()} manually. Artist: ${currentUser?.email}. Send me payment details.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.15)]">
        
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Secure Checkout</h2>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">GTL Records • Manual Route</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {status === 'idle' && (
            <div className="animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 mb-8 p-4 bg-black rounded-3xl border border-zinc-800">
                <img src={beat.coverUrl} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-white font-black uppercase italic leading-none mb-1">{beat.title}</h3>
                  <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">{licenseType} License</p>
                  <p className="text-white font-black text-xl mt-1">KSH {price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Manual WhatsApp Option - THE REQUESTED PRIMARY METHOD */}
                <button 
                  onClick={handleWhatsAppPay}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-green-500/20 uppercase italic flex flex-col items-center justify-center group"
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                    Direct Pay (WhatsApp)
                  </span>
                  <span className="text-[8px] opacity-70 mt-1 uppercase tracking-widest">Manual Confirmation • 24/7 Delivery</span>
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-[8px] uppercase font-black"><span className="bg-zinc-900 px-3 text-zinc-600 tracking-[0.4em]">OR AUTO SIMULATION</span></div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest ml-1 text-center">Enter M-Pesa Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white font-black focus:ring-2 focus:ring-green-500 outline-none transition-all text-center text-lg tracking-widest"
                    />
                    <button 
                      onClick={handleSTKPush}
                      className="bg-zinc-800 text-white font-black px-6 rounded-2xl transition-all active:scale-95 hover:bg-zinc-700 uppercase italic text-[10px]"
                    >
                      Push
                    </button>
                  </div>
                </div>

                <p className="text-[8px] text-zinc-700 text-center font-bold uppercase tracking-widest leading-relaxed px-4">
                  Note: Manual WhatsApp payment is verified personally by BYTEBEATZ44 for secure file delivery.
                </p>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full animate-spin text-green-500" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="200" strokeDashoffset="100"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">
                  {countdown}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Waiting for PIN</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px] mx-auto mt-2">Enter your M-Pesa PIN on the phone to complete simulation.</p>
              </div>
              <button 
                onClick={handleWhatsAppPay}
                className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Go back to Manual WhatsApp
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Done!</h3>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Simulation complete. For the real files, chat on WhatsApp now.</p>
              </div>
              <button 
                onClick={handleWhatsAppPay}
                className="w-full bg-[#22c55e] text-white font-black py-5 rounded-2xl transition-all active:scale-95 uppercase italic shadow-xl shadow-green-500/20"
              >
                Chat for Real Link
              </button>
              <button 
                onClick={onClose}
                className="block mx-auto text-zinc-600 text-[9px] font-black uppercase tracking-widest hover:text-white"
              >
                Marketplace
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-black/40 text-center">
           <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">COPYRIGHT 2026 GTL RECORDS 44 • +254 105 076 414</p>
        </div>
      </div>
    </div>
  );
};
