import React from 'react';
import { motion } from 'motion/react';
import { Play, Tv } from 'lucide-react';
import { Channel } from '../types';
import { cn } from '../lib/utils';

interface ChannelCardProps {
  channel: Channel;
  index?: number;
  isActive: boolean;
  onSelect: (channel: Channel) => void;
  isFocused?: boolean;
  layoutStyle?: 'grid' | 'list';
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ 
  channel, 
  index,
  isActive, 
  onSelect, 
  isFocused,
  layoutStyle = 'grid'
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (layoutStyle === 'list') {
    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(channel)}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 border-2",
          "bg-[#121821] border-[#1f2937] hover:border-[#00a3e0]/30",
          isActive ? "border-red-500 bg-red-500/5" : "",
          isFocused ? "border-white ring-2 ring-white/20" : ""
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-black/40 p-2 flex items-center justify-center shrink-0">
             {!imgError ? (
                <img
                    src={channel.logo}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={() => setImgError(true)}
                />
             ) : (
                <Tv className="w-6 h-6 text-white/20" />
             )}
          </div>
          <div className="text-left">
            <h3 className={cn(
                "text-lg font-bold leading-tight",
                isActive ? "text-white" : "text-white/80"
            )}>
              {channel.name}
            </h3>
            <p className="text-xs text-white/40 uppercase tracking-widest">{channel.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              // Current implementation is a UI selector as requested
              // Future: connect this to HLS quality levels in VideoPlayer
              console.log("Resolution set to:", e.target.value);
            }}
            className="bg-[#1f2937] text-[10px] text-white/60 font-bold px-2 py-1 rounded-md border-none focus:ring-0 cursor-pointer hover:bg-[#2d3748] transition-colors"
            defaultValue="auto"
          >
            <option value="auto">AUTO</option>
            <option value="1080">1080p</option>
            <option value="720">720p</option>
            <option value="480">480p</option>
          </select>

          <div className={cn(
              "px-3 py-1 rounded-md text-xs font-bold font-mono tracking-tighter shrink-0",
              isActive ? "bg-red-500 text-white" : "bg-[#1f2937] text-white/40"
          )}>
            CH {index || channel.id.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(channel)}
      className={cn(
        "relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300",
        "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20",
        isActive ? "ring-2 ring-blue-500 bg-white/10 border-blue-500/50" : "",
        isFocused ? "ring-4 ring-white bg-white/20 scale-105" : ""
      )}
      id={`channel-${channel.id}`}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black/40 flex items-center justify-center p-4">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <Play className="w-12 h-12 text-white/10" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>
      <h3 className="mt-3 text-sm font-medium text-white/90 group-hover:text-white truncate w-full text-center">
        {channel.name}
      </h3>
      <span className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
        {channel.category}
      </span>
    </motion.button>
  );
};
