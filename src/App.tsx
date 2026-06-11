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
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans selection:bg-red-500/30">
      {/* Top Brand Header */}
      <header className="pt-6 px-4 pb-2 text-center">
        <h1 className="text-2xl font-black tracking-tighter flex items-center justify-center gap-2">
          <span className="text-white">FREETV</span>
          <span className="text-[#ff3b3b] animate-pulse">FIFA WORLD CUP 2026 LIVE</span>
        </h1>
      </header>

      {/* Action Buttons */}
      <div className="flex gap-4 px-4 py-4 max-w-lg mx-auto w-full">
        <button className="flex-1 bg-[#ff3b3b] hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg active:scale-95 transition-all text-sm uppercase">
          FULLSCREEN (OK)
        </button>
        <button className="flex-1 bg-[#00a3e0] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg active:scale-95 transition-all text-sm uppercase">
          SHARE STREAM
        </button>
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

        {/* Dummy Ad / Sponsored Banner */}
        <div className="w-full bg-[#f8f9fa] rounded-lg overflow-hidden mb-8 border border-white/10">
            <div className="bg-[#00a3e0] text-white text-[10px] font-bold px-2 py-0.5 inline-block rounded-br-lg">
                SPONSORED
            </div>
            <div className="p-1 h-16 flex items-center justify-center grayscale opacity-80">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_of_Bangladesh_Television.svg/1024px-Logo_of_Bangladesh_Television.svg.png" alt="Ad" className="h-full object-contain" />
                <span className="text-[#007b33] font-black text-xl ml-2">রাজশাহীর পিওর আম</span>
            </div>
        </div>

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
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  index={index + 1}
                  isActive={activeChannel?.id === channel.id}
                  isFocused={focusedIndex === index}
                  onSelect={setActiveChannel}
                  layoutStyle="list"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Persistence / Floating Player for Mobile if needed, 
          but current request wants embedded vertical look */}
    </div>
  );
}
