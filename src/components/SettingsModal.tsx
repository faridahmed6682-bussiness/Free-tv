import React, { useState } from 'react';
import { X, Save, AlertCircle, PlayCircle, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  error?: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, error }) => {
  const [activeTab, setActiveTab] = useState<'m3u' | 'xtream'>('m3u');
  const [m3uUrl, setM3uUrl] = useState('');
  
  // Xtream Codes
  const [xtreamUrl, setXtreamUrl] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');

  const handleSave = () => {
    if (activeTab === 'm3u') {
      onSave({ type: 'm3u', url: m3uUrl });
    } else {
      onSave({ 
        type: 'xtream', 
        url: xtreamUrl,
        username: xtreamUser,
        password: xtreamPass
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#161b22] border border-[#30363d] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Library className="w-5 h-5 text-[#ff3b3b]" />
              Add Custom IPTV
            </h2>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full transition-colors hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-[#0d1117] flex gap-2">
             <button
                onClick={() => setActiveTab('m3u')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  activeTab === 'm3u' 
                  ? 'bg-[#238636] text-white shadow-lg shadow-[#238636]/20' 
                  : 'bg-[#21262d] text-white/60 hover:text-white hover:bg-[#30363d]'
                }`}
             >
                M3U Playlist
             </button>
             <button
                onClick={() => setActiveTab('xtream')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  activeTab === 'xtream' 
                  ? 'bg-[#238636] text-white shadow-lg shadow-[#238636]/20' 
                  : 'bg-[#21262d] text-white/60 hover:text-white hover:bg-[#30363d]'
                }`}
             >
                Xtream Codes
             </button>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex gap-2 items-start mb-4">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {activeTab === 'm3u' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">M3U Playlist URL</label>
                  <input
                    type="url"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    placeholder="https://example.com/playlist.m3u"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#238636]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'xtream' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Server URL (with port)</label>
                  <input
                    type="url"
                    value={xtreamUrl}
                    onChange={(e) => setXtreamUrl(e.target.value)}
                    placeholder="http://iptv-server.com:8080"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#238636]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                    <input
                      type="text"
                      value={xtreamUser}
                      onChange={(e) => setXtreamUser(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#238636]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                    <input
                      type="password"
                      value={xtreamPass}
                      onChange={(e) => setXtreamPass(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#238636]"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-white/40 leading-relaxed mt-4">
              All credentials are saved locally in your browser. Live channels will be added to your guide and routed through our proxy server to bypass CORS.
            </p>
          </div>

          <div className="p-4 border-t border-[#30363d] bg-[#0d1117]">
            <button
              onClick={handleSave}
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" />
              Save & Load Playlist
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
