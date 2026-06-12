import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Search, Info, LayoutGrid, MonitorPlay, Settings, RefreshCw, AlertCircle, LogIn, LogOut, Download } from 'lucide-react';
import { CHANNELS as INITIAL_CHANNELS, CATEGORIES } from './data/channels';
import { ChannelCard } from './components/ChannelCard';
import { VideoPlayer } from './components/VideoPlayer';
import { CategoryFilter } from './components/CategoryFilter';
import { SettingsModal } from './components/SettingsModal';
import { SponsorMarquee } from './components/SponsorMarquee';
import { Channel } from './types';
import { cn } from './lib/utils';
import { fetchIptvOrgChannels, fetchCustomM3U, fetchXtreamLive, fetchFeaturedPlaylists } from './lib/iptv-service';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getUserConfig, saveUserConfig, UserConfig } from './lib/configService';
import { usePWAInstall } from './hooks/usePWAInstall';

const ADMIN_EMAIL = 'faridahmed6682@gmail.com';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS.map(c => ({ ...c, status: 'checking' })));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const channelBuffer = React.useRef("");
  const bufferTimeout = React.useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);
  
  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { isInstallable, install } = usePWAInstall();

  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Background Channel Watchdog: Periodically check if channels are alive
  useEffect(() => {
    if (channels.length === 0) return;

    const checkChannel = async (channel: Channel) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch(`/api/iptv/proxy?url=${encodeURIComponent(channel.url)}`, {
          method: 'HEAD', // HEAD request is lighter
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (e) {
        return false;
      }
    };

    const runWatchdog = async () => {
      // Check channels that are still 'checking' or haven't been validated
      const channelsToCheck = channels.filter(c => c.status === 'checking').slice(0, 5);
      
      if (channelsToCheck.length === 0) return;

      const results = await Promise.all(channelsToCheck.map(async (c) => ({
        id: c.id,
        online: await checkChannel(c)
      })));

      setChannels(prev => prev.map(c => {
        const res = results.find(r => r.id === c.id);
        if (res) {
          return { ...c, status: res.online ? 'online' : 'offline' };
        }
        return c;
      }));
    };

    const interval = setInterval(runWatchdog, 3000);
    return () => clearInterval(interval);
  }, [channels]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setChannels(INITIAL_CHANNELS.map(c => ({ ...c, status: 'checking' })));
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Fetch dynamic channels from iptv-org and custom settings
  const syncChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bdChannels, inChannels, featuredChannels] = await Promise.all([
        fetchIptvOrgChannels('bd'),
        fetchIptvOrgChannels('in'),
        fetchFeaturedPlaylists()
      ]);
      
      let customChannels: Channel[] = [];
      let config: any = null;
      
      if (user) {
         try {
           config = await getUserConfig();
         } catch (e) {}
      } else {
         const savedConfig = localStorage.getItem('iptvConfig');
         if (savedConfig) {
            try { config = JSON.parse(savedConfig); } catch (e) {}
         }
      }

      if (config) {
        try {
          if (config.configType === 'm3u' || config.type === 'm3u') {
             customChannels = await fetchCustomM3U(config.url);
          } else if ((config.configType === 'xtream' || config.type === 'xtream') && config.url && config.username && config.password) {
             customChannels = await fetchXtreamLive(config.url, config.username, config.password);
          }
        } catch (e) {}
      }

      const allFetched = [...bdChannels, ...inChannels, ...featuredChannels, ...customChannels].map(c => ({
        ...c,
        status: 'checking' as const
      }));
      
      if (allFetched.length > 0) {
        setChannels(prev => {
          const existingUrls = new Set(prev.map(c => c.url));
          const newChannels = allFetched.filter(c => !existingUrls.has(c.url));
          return [...prev, ...newChannels];
        });
      }
    } catch (err) {
      setError('Signal synchronization temporarily occupied.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleSaveSettings = async (config: any) => {
    if (!isAdmin) return;
    setSettingsError(null);
    try {
        let customChannels: Channel[] = [];
        if (config.type === 'm3u' && config.url) {
             customChannels = await fetchCustomM3U(config.url);
        } else if (config.type === 'xtream' && config.url && config.username && config.password) {
             customChannels = await fetchXtreamLive(config.url, config.username, config.password);
        }
        
        if (customChannels.length > 0) {
            if (user) {
              await saveUserConfig({
                configType: config.type,
                url: config.url,
                username: config.username,
                password: config.password
              });
            } else {
              localStorage.setItem('iptvConfig', JSON.stringify(config));
            }
            
            setChannels(prev => {
                const existingUrls = new Set(prev.map(c => c.url));
                const newChannels = customChannels.filter(c => !existingUrls.has(c.url)).map(c => ({ ...c, status: 'online' as const }));
                return [...prev, ...newChannels];
            });
            setIsSettingsOpen(false);
        } else {
            setSettingsError('No live signals detected.');
        }
    } catch (err: any) {
        setSettingsError('Signal connection failed. Verify endpoint.');
    }
  };

  useEffect(() => {
    syncChannels();
  }, [syncChannels]);

  const filteredChannels = useMemo(() => {
    return channels
      .filter(channel => {
        const isLive = channel.status !== 'offline';
        const matchesCategory = selectedCategory === 'All' || 
          channel.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
        return isLive && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Priority 1: Status (Online first)
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (a.status !== 'online' && b.status === 'online') return 1;

        // Priority 2: Country (Bangladesh > India > Others)
        const countryPriority = (country?: string) => {
          if (country === 'Bangladesh') return 3;
          if (country === 'India') return 2;
          return 1;
        };

        const pA = countryPriority(a.country);
        const pB = countryPriority(b.country);

        if (pA > pB) return -1;
        if (pA < pB) return 1;

        // Priority 3: Alphabetical name
        return a.name.localeCompare(b.name);
      });
  }, [selectedCategory, searchQuery, channels]);

  // Handle keyboard navigation for TV
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeChannel) return; // Disable main navigation when player is open

    const cols = window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
    
    // Numeric key support (0-9)
    if (/^[0-9]$/.test(e.key)) {
      clearTimeout(bufferTimeout.current);
      channelBuffer.current += e.key;
      
      const channelNum = parseInt(channelBuffer.current);
      const targetIndex = filteredChannels.findIndex((_, idx) => idx + 1 === channelNum);
      
      if (targetIndex !== -1) {
        setFocusedIndex(targetIndex);
      }

      bufferTimeout.current = setTimeout(() => {
        const finalNum = parseInt(channelBuffer.current);
        const finalIndex = filteredChannels.findIndex((_, idx) => idx + 1 === finalNum);
        if (finalIndex !== -1) {
          setActiveChannel(filteredChannels[finalIndex]);
        }
        channelBuffer.current = "";
      }, 1500); // 1.5s window to type 
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
        setFocusedIndex(prev => Math.min(prev + 1, filteredChannels.length - 1));
        break;
      case 'ArrowLeft':
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        setFocusedIndex(prev => Math.min(prev + cols, filteredChannels.length - 1));
        break;
      case 'ArrowUp':
        setFocusedIndex(prev => Math.max(prev - cols, 0));
        break;
      case 'Enter':
        if (filteredChannels[focusedIndex]) {
          setActiveChannel(filteredChannels[focusedIndex]);
        }
        break;
    }
  }, [activeChannel, filteredChannels, focusedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset focus when category changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [selectedCategory]);

  // Scroll focused element into view for TV navigation
  useEffect(() => {
    if (focusedIndex >= 0 && !activeChannel) {
      const element = document.getElementById(`channel-focus-${focusedIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedIndex, activeChannel]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-hidden w-full fixed inset-0">
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center">
        {/* Top Brand Header */}
        <header className="pt-8 px-4 pb-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#000000] to-transparent w-full max-w-full">
          {/* Branding & Action row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4 w-full px-2">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none active:opacity-70 transition-opacity"
              onDoubleClick={() => !user && handleLogin()}
              title={!user ? "Double click to manage" : ""}
            >
               <Tv className="w-7 h-7 md:w-8 md:h-8 text-[#ff3b3b]" />
               <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center justify-center">
                 <span className="text-white">FREE</span>
                 <span className="text-[#ff3b3b]">TV</span>
               </h1>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={install}
                className={cn(
                  "flex items-center gap-2 bg-[#ff3b3b]/10 text-[#ff3b3b] border border-[#ff3b3b]/20 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#ff3b3b] hover:text-white shrink-0",
                  !isInstallable && "opacity-60 cursor-not-allowed"
                )}
              >
                <Download className="w-3 h-3" />
                Install App
              </button>

              <button 
                onClick={() => {
                  const el = document.documentElement;
                  if (el.requestFullscreen) el.requestFullscreen();
                }}
                className="bg-[#238636] text-white border border-green-500/20 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all hover:bg-green-600 shrink-0 flex items-center gap-2"
              >
                <MonitorPlay className="w-3 h-3" />
                Full Screen
              </button>
            </div>
          </div>
          
          <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold text-center max-w-sm mb-4">
            Global & Regional Broadcasting Hub
          </p>
          
          {isAdmin && user && (
            <div className="flex items-center gap-2 mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Admin Center</span>
              <button onClick={handleLogout} className="text-[#ff3b3b] hover:text-red-400 text-[10px] flex items-center gap-1 font-black uppercase tracking-widest">
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          )}
        </header>

        {/* Action Buttons - Pruned */}
        <div className="flex gap-4 px-4 py-4 max-w-lg mx-auto w-full">
          <button 
            onClick={syncChannels}
            disabled={isLoading}
            className="flex-1 bg-[#121821] hover:bg-[#1f2937] text-white font-bold p-3 rounded-lg border border-[#1f2937] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-wider"
            title="Refresh Signals"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Sync Signals
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 px-4 rounded-lg shadow-lg active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2 border border-green-500/20"
            >
              <Settings className="w-4 h-4" /> ADMIN PANEL
            </button>
          )}
        </div>

      {/* Instruction Banner */}
      <div className="px-4 text-center mb-6">
        <p className="text-white/80 text-sm font-medium leading-relaxed">
          চ্যানেল পরিবর্তনের পর ৫ সেকেন্ড সময় দিবেন <br /> কমপক্ষে
        </p>
      </div>

      {/* Main Container managed for scrolling */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-12">
        
        {/* Active Channel Player Area */}
        <div className="w-full mb-4">
          <div className="mb-2">
             <h2 className="text-[#00a3e0] text-xl font-bold">
               {activeChannel ? activeChannel.name : 'Select a Channel'}
             </h2>
          </div>
          
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border-2 border-[#1f2937] relative ring-4 ring-[#1f2937]/50 shadow-2xl">
            {activeChannel ? (
              <VideoPlayer 
                channel={activeChannel} 
                onClose={() => setActiveChannel(null)} 
                embedded={true}
              />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
                    <MonitorPlay className="w-16 h-16 opacity-20" />
                    <p className="font-medium">Pick a channel to start streaming</p>
                </div>
            )}
          </div>
        </div>

        {/* Sponsor Marquee Slider */}
        <SponsorMarquee />

        {/* Search and List Header */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white/90">Scroll or Search</h3>
            <p className="text-white/40 text-sm">We also support tv remote 123 buttons</p>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search channel name..."
              className="w-full bg-[#121821] border border-[#1f2937] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#00a3e0]/50 transition-all placeholder:text-white/20 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Vertical List for Channels */}
          <div className="space-y-3 mt-6">
            <AnimatePresence mode="popLayout">
              {filteredChannels.map((channel, index) => (
                  <div key={channel.id} id={`channel-focus-${index}`}>
                    <ChannelCard
                      channel={channel}
                      index={index + 1}
                      isActive={activeChannel?.id === channel.id}
                      isFocused={focusedIndex === index}
                      onSelect={setActiveChannel}
                      layoutStyle="list"
                    />
                  </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Persistence / Floating Player for Mobile if needed, 
          but current request wants embedded vertical look */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveSettings}
        error={settingsError} 
        isAdmin={isAdmin}
      />
      </div>
    </div>
  );
}
