
import React, { useState, useRef } from 'react';
import { Beat } from '../types';

interface AddBeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (beat: Beat, audioBlob?: Blob, coverBlob?: Blob) => void;
}

export const AddBeatModal: React.FC<AddBeatModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Trap',
    bpm: 140,
    price: 100,
    mood: '',
    description: '',
  });
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      alert("Please select an audio file for your beat.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const newBeat: Beat = {
        id: `GTL_${Date.now()}`,
        title: formData.title,
        producer: 'BYTEBEATZ44',
        genre: formData.genre,
        mood: formData.mood.split(',').map(m => m.trim()).filter(m => m !== ''),
        bpm: Number(formData.bpm),
        key: 'C Minor', 
        price: Number(formData.price),
        audioUrl: '', // Will be updated by Firebase upload
        coverUrl: '', // Will be updated by Firebase upload
        description: formData.description,
      };

      // Pass the actual files for cloud upload
      await onAdd(newBeat, audioFile, coverFile || undefined);
      
      onClose();
      // Reset state
      setFormData({ title: '', genre: 'Trap', bpm: 140, price: 100, mood: '', description: '' });
      setAudioFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to process cloud upload. Check your internet connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Cloud Distribution</h2>
            <p className="text-zinc-500 text-sm">Upload heat directly to GTL global servers.</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => audioInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${audioFile ? 'border-cyan-500 bg-cyan-500/5' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <input 
                type="file" 
                ref={audioInputRef} 
                onChange={e => setAudioFile(e.target.files?.[0] || null)}
                accept="audio/*" 
                className="hidden" 
              />
              <div className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full ${audioFile ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              </div>
              <p className="text-sm font-bold text-white">{audioFile ? audioFile.name : 'Cloud Audio'}</p>
              <p className="text-xs text-zinc-500 mt-1">Direct Master Upload</p>
            </div>

            <div 
              onClick={() => coverInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${coverFile ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <input 
                type="file" 
                ref={coverInputRef} 
                onChange={e => setCoverFile(e.target.files?.[0] || null)}
                accept="image/*" 
                className="hidden" 
              />
              <div className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full ${coverFile ? 'bg-purple-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <p className="text-sm font-bold text-white">{coverFile ? coverFile.name : 'Cover Art'}</p>
              <p className="text-xs text-zinc-500 mt-1">Artist Preview</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Beat Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
                placeholder="Name your track..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Genre</label>
              <select 
                value={formData.genre}
                onChange={e => setFormData({...formData, genre: e.target.value})}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
              >
                <option>Trap</option>
                <option>Drill</option>
                <option>Afro-Fusion</option>
                <option>R&B</option>
                <option>Boom Bap</option>
                <option>Synthwave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">BPM</label>
              <input 
                type="number"
                required
                value={formData.bpm}
                onChange={e => setFormData({...formData, bpm: parseInt(e.target.value)})}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Price (KSH)</label>
              <input 
                type="number"
                min="100"
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Moods</label>
              <input 
                value={formData.mood}
                onChange={e => setFormData({...formData, mood: e.target.value})}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Dark, Moody, Hype"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Distribution Note</label>
            <textarea 
              rows={2}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
              placeholder="Vibe check..."
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isUploading}
              className="w-full bg-cyan-500 hover:bg-white text-black font-black text-lg py-5 rounded-2xl transition-all shadow-2xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Broadcasting Hit...
                </>
              ) : (
                'Push to Market'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
