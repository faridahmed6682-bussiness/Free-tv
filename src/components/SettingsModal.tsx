import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Library, Megaphone, Trash2, Plus, Edit2, Link, Image, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sponsor } from '../types';
import { getAllSponsors, saveSponsor, deleteSponsor } from '../lib/sponsorService';
import { auth } from '../lib/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  error?: string | null;
  isAdmin?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  error, 
  isAdmin = false 
}) => {
  const [activeSegment, setActiveSegment] = useState<'iptv' | 'sponsors'>('iptv');
  const [activeTab, setActiveTab] = useState<'m3u' | 'xtream'>('m3u');
  const [m3uUrl, setM3uUrl] = useState('');
  
  // Xtream Codes
  const [xtreamUrl, setXtreamUrl] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');

  // Sponsors configuration state
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formId, setFormId] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formText, setFormText] = useState('');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSponsorLoading, setIsSponsorLoading] = useState(false);

  const loadSponsors = async () => {
    setIsSponsorLoading(true);
    setFormError(null);
    try {
      const list = await getAllSponsors();
      setSponsors(list);
    } catch (e) {
      console.error(e);
      setFormError('Unable to connect to service.');
    } finally {
      setIsSponsorLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeSegment === 'sponsors') {
      loadSponsors();
    }
  }, [isOpen, activeSegment]);

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

  const handleSaveSponsorItem = async () => {
    if (!formImageUrl.trim() || !formText.trim()) {
      setFormError('Logo Image URL and Sponsor Text are required fields.');
      return;
    }
    setFormError(null);
    setIsSponsorLoading(true);
    try {
      const targetId = formId || `sponsor_${Date.now()}`;
      await saveSponsor({
        id: targetId,
        imageUrl: formImageUrl.trim(),
        text: formText.trim(),
        linkUrl: formLinkUrl.trim(),
        isActive: formIsActive
      });
      
      // Clear form
      setFormId('');
      setFormImageUrl('');
      setFormText('');
      setFormLinkUrl('');
      setFormIsActive(true);
      setIsEditing(false);
      
      // Reload
      await loadSponsors();
    } catch (e: any) {
      console.error(e);
      setFormError('Validation restriction. Please confirm details.');
    } finally {
      setIsSponsorLoading(false);
    }
  };

  const handleEditSponsorItem = (item: Sponsor) => {
    setFormId(item.id);
    setFormImageUrl(item.imageUrl);
    setFormText(item.text);
    setFormLinkUrl(item.linkUrl || '');
    setFormIsActive(item.isActive !== false);
    setIsEditing(true);
    setFormError(null);
  };

  const handleDeleteSponsorItem = async (id: string) => {
    if (!window.confirm('Are you holding complete deletion permission? Complete removal cannot be undone.')) return;
    setIsSponsorLoading(true);
    try {
      await deleteSponsor(id);
      if (formId === id) {
        setFormId('');
        setFormImageUrl('');
        setFormText('');
        setFormLinkUrl('');
        setFormIsActive(true);
        setIsEditing(false);
      }
      await loadSponsors();
    } catch (e) {
      console.error(e);
      setFormError('Failed to complete delete request.');
    } finally {
      setIsSponsorLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#161b22] border border-[#30363d] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8"
        >
          {/* Main Title Header */}
          <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
            <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <Library className="w-5 h-5 text-[#ff3b3b]" />
              {isAdmin ? "ADMIN CONTROL CENTER" : "ADD IPTV STREAM"}
            </h2>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full transition-colors hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Segment Switching */}
          {isAdmin && (
            <div className="p-2 bg-[#0d1117] border-b border-[#30363d] flex gap-1">
              <button
                onClick={() => setActiveSegment('iptv')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${
                  activeSegment === 'iptv' 
                    ? 'bg-[#ff3b3b] text-white shadow-lg shadow-[#ff3b3b]/20Code' 
                    : 'bg-transparent text-white/50 hover:text-white'
                }`}
              >
                IPTV Playlists
              </button>
              <button
                onClick={() => setActiveSegment('sponsors')}
                className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  activeSegment === 'sponsors' 
                    ? 'bg-[#ff3b3b] text-white shadow-lg shadow-[#ff3b3b]/20' 
                    : 'bg-transparent text-white/50 hover:text-white'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" /> Sponsor Ads
              </button>
            </div>
          )}

          {activeSegment === 'iptv' ? (
            <>
              {/* IPTV Tab Selector */}
              <div className="p-4 bg-[#0d1117] flex gap-2 border-b border-[#30363d]/40">
                 <button
                    onClick={() => setActiveTab('m3u')}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${
                      activeTab === 'm3u' 
                      ? 'bg-white/10 text-white' 
                      : 'bg-[#21262d]/40 text-white/40 hover:text-white'
                    }`}
                 >
                    M3U Playlist
                 </button>
                 <button
                    onClick={() => setActiveTab('xtream')}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all ${
                      activeTab === 'xtream' 
                      ? 'bg-white/10 text-white' 
                      : 'bg-[#21262d]/40 text-white/40 hover:text-white'
                    }`}
                 >
                    Xtream Codes
                 </button>
              </div>

              {/* IPTV Content Form */}
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex gap-2 items-start">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {activeTab === 'm3u' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">M3U Playlist URL</label>
                      <input
                        type="url"
                        value={m3uUrl}
                        onChange={(e) => setM3uUrl(e.target.value)}
                        placeholder="https://example.com/playlist.m3u"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">Server URL (with port)</label>
                      <input
                        type="url"
                        value={xtreamUrl}
                        onChange={(e) => setXtreamUrl(e.target.value)}
                        placeholder="http://iptv-server.com:8080"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">Username</label>
                        <input
                          type="text"
                          value={xtreamUser}
                          onChange={(e) => setXtreamUser(e.target.value)}
                          placeholder="Username"
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">Password</label>
                        <input
                          type="password"
                          value={xtreamPass}
                          onChange={(e) => setXtreamPass(e.target.value)}
                          placeholder="Password"
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-[11px] text-white/30 leading-relaxed">
                  All signal feeds routes dynamically bypass CORS limitations. Added channels load seamlessly into dashboard filters.
                </p>
              </div>

              {/* IPTV Footer Save Button */}
              <div className="p-4 border-t border-[#30363d] bg-[#0d1117]">
                <button
                  onClick={handleSave}
                  className="w-full bg-[#ff3b3b] hover:bg-red-600 text-white font-black uppercase tracking-wider text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Save & Load Playlist
                </button>
              </div>
            </>
          ) : (
            // SPONSOR ADS CONTROL AREA FOR ADMINS
            <div className="flex flex-col h-[500px]">
              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="font-bold">{formError}</p>
                  </div>
                )}

                {/* Form to Create / Update Sponsor item */}
                <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[11px] font-black text-[#ff3b3b] uppercase tracking-widest flex items-center gap-1">
                      {isEditing ? <Edit2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {isEditing ? 'Editing Sponsor ad' : 'Add New Sponsor Advertisement'}
                    </span>
                    {isEditing && (
                      <button 
                        className="text-white/40 hover:text-white text-[10px] uppercase font-bold"
                        onClick={() => {
                          setFormId('');
                          setFormImageUrl('');
                          setFormText('');
                          setFormLinkUrl('');
                          setFormIsActive(true);
                          setIsEditing(false);
                        }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-white/55 mb-1 flex items-center gap-1">
                        <Image className="w-3 h-3" /> Logo / Image URL
                      </label>
                      <input 
                        type="url"
                        placeholder="https://i.imgur.com/...png"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#ff3b3b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-white/55 mb-1 flex items-center gap-1">
                        📢 Sponsor Text / Slogan
                      </label>
                      <input 
                        type="text"
                        placeholder="রাজশাহীর পিওর আম (কম্পানি নাম বা স্লেগান)"
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#ff3b3b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-white/55 mb-1 flex items-center gap-1">
                        <Link className="w-3 h-3" /> External Link URL (Optional)
                      </label>
                      <input 
                        type="url"
                        placeholder="https://facebook.com/my-page (Optional)"
                        value={formLinkUrl}
                        onChange={(e) => setFormLinkUrl(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#ff3b3b]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1 select-none">
                      <input 
                        type="checkbox" 
                        id="form-is-active"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="rounded border-[#30363d] text-[#ff3b3b] focus:ring-0 cursor-pointer h-4 w-4 bg-[#161b22]"
                      />
                      <label htmlFor="form-is-active" className="text-xs text-white/80 font-bold cursor-pointer uppercase tracking-wide">
                        Visible in dynamic sliders (Active)
                      </label>
                    </div>

                    <button
                      onClick={handleSaveSponsorItem}
                      disabled={isSponsorLoading}
                      className="w-full bg-[#238636] hover:bg-green-600 font-bold text-white uppercase tracking-wider text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 shadow transition-all active:scale-95 text-center"
                    >
                      {isSponsorLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      {isEditing ? 'Save Changes' : 'Publish Sponsor Ad'}
                    </button>
                  </div>
                </div>

                {/* List of current Sponsors */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#ff3b3b] mb-3">
                    Active & Draft Sponsors list ({sponsors.length})
                  </h3>

                  {isSponsorLoading && sponsors.length === 0 ? (
                    <div className="flex justify-center py-6 text-white/40">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                  ) : sponsors.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-4">No sponsors created. Add your first dynamic sponsor banner above!</p>
                  ) : (
                    <div className="space-y-2">
                      {sponsors.map((item) => (
                        <div key={item.id} className="bg-[#161b22] border border-white/5 p-2 rounded-lg flex items-center justify-between gap-3 text-xs leading-none">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.text} className="h-7 w-7 rounded object-cover shrink-0 bg-white/5 border border-white/5" />
                            ) : (
                              <div className="w-7 h-7 rounded bg-white/5 tracking-tighter shrink-0 flex items-center justify-center text-[10px] font-bold text-white/30">AD</div>
                            )}
                            <div className="text-left overflow-hidden">
                              <p className="font-bold text-white/90 truncate">{item.text}</p>
                              {item.linkUrl ? (
                                <p className="text-[10px] text-white/30 truncate mt-0.5">{item.linkUrl}</p>
                              ) : (
                                <p className="text-[10px] text-[#ff3b3b]/60 mt-0.5">No redirect link</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${item.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                              {item.isActive ? 'Live' : 'Draft'}
                            </span>
                            <button 
                              onClick={() => handleEditSponsorItem(item)}
                              title="Edit item" 
                              className="p-1 px-1.5 bg-[#ff3b3b]/10 text-white/70 hover:text-white rounded hover:bg-[#ff3b3b]/30 transition-all border border-[#ff3b3b]/20"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSponsorItem(item.id)}
                              title="Delete permanently" 
                              className="p-1 px-1.5 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors border border-red-500/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sponsors Footer Action */}
              <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex justify-between items-center text-[11px] font-mono text-white/30 tracking-tight">
                <span>VERIFIED ADMIN: {auth.currentUser?.email}</span>
                <span>UTC: JUN 2026</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
