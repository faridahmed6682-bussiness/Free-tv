import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Search, Info, LayoutGrid, MonitorPlay, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { CHANNELS as INITIAL_CHANNELS, CATEGORIES } from './data/channels';
import { ChannelCard } from './components/ChannelCard';
import { VideoPlayer } from './components/VideoPlayer';
import { CategoryFilter } from './components/CategoryFilter';
import { Channel } from './types';
import { cn } from './lib/utils';
import { fetchIptvOrgChannels } from './lib/iptv-service';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App Initialized. Base Channels:', INITIAL_CHANNELS.length);
  }, []);

  // Fetch dynamic channels from iptv-org
  const syncChannels = useCallback(async () => {
    console.log('Syncing Channels...');
    setIsLoading(true);
    setError(null);
    try {
      const iptvChannels = await fetchIptvOrgChannels('bd');
      console.log('Fetched from IPTV-org:', iptvChannels.length);
      if (iptvChannels.length > 0) {
        setChannels(prev => {
          const existingUrls = new Set(prev.map(c => c.url));
          const newChannels = iptvChannels.filter(c => !existingUrls.has(c.url));
          const merged = [...prev, ...newChannels];
          console.log('Total merged channels:', merged.length);
          return merged;
        });
      } else {
        console.warn('IPTV-org returned 0 channels');
      }
    } catch (err) {
      console.error('Sync Error:', err);
      setError('Failed to sync with IPTV-org');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncChannels();
  }, [syncChannels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesCategory = selectedCategory === 'All' || 
        channel.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, channels]);

  // Handle keyboard navigation for TV
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeChannel) return; // Disable main navigation when player is open

    const cols = window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
    
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

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={cn(
        "bg-[#121214] border-r border-white/5 transition-all duration-300 hidden md:flex flex-col",
        isSidebarExpanded ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Tv className="w-6 h-6 text-white" />
          </div>
          {isSidebarExpanded && <span className="font-bold text-xl tracking-tight">LIVE TV</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { icon: LayoutGrid, label: 'Dashboard', active: true },
            { icon: MonitorPlay, label: 'Live Streams' },
            { icon: Tv, label: 'TV Shows' },
            { icon: RefreshCw, label: 'Sync IPTV', onClick: syncChannels, loading: isLoading },
            { icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                item.active ? "bg-blue-600/10 text-blue-500" : "text-white/40 hover:bg-white/5 hover:text-white",
                item.loading && "animate-pulse opacity-50 pointer-events-none"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", item.loading && "animate-spin")} />
              {isSidebarExpanded && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
           <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
           >
             <Info className="w-5 h-5 flex-shrink-0" />
             {isSidebarExpanded && <span className="text-sm font-medium">App Info</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <header className="sticky top-0 z-20 bg-[#0a0a0b]/80 backdrop-blur-xl px-4 md:px-8 py-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative group flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search channels..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                {isLoading && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
                {error && <AlertCircle className="w-3 h-3 text-red-500" />}
                <span className="text-white/40 text-[10px] font-mono tracking-tighter uppercase">
                  {isLoading ? 'Syncing IPTV-org...' : error ? 'Sync Error' : 'IPTV-org Connected'}
                </span>
              </div>
              <span className="text-sm font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {isLoading && channels.length === INITIAL_CHANNELS.length && (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-white/40">Syncing live channels...</p>
             </div>
          )}

          {!isLoading && filteredChannels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/20">
              <Search className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-lg">No channels match your search or category</p>
              <button 
                onClick={syncChannels}
                className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white transition-all"
              >
                Try Refreshing
              </button>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Categories</h2>
              <span className="text-sm text-white/40">{filteredChannels.length} Channels found</span>
            </div>
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredChannels.map((channel, index) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  isActive={activeChannel?.id === channel.id}
                  isFocused={focusedIndex === index}
                  onSelect={setActiveChannel}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info for TV users */}
        <div className="p-8 mt-20 text-center border-t border-white/5">
            <p className="text-white/20 text-xs md:text-sm">
                Use Arrow Keys to navigate • Enter to play • Optimized for Android TV & Mobile
            </p>
        </div>
      </main>

      {/* Video Player Portal */}
      <AnimatePresence>
        {activeChannel && (
          <VideoPlayer 
            channel={activeChannel} 
            onClose={() => setActiveChannel(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
