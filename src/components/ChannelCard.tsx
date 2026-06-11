import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Channel } from '../types';
import { cn } from '../lib/utils';

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  onSelect: (channel: Channel) => void;
  isFocused?: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, isActive, onSelect, isFocused }) => {
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
        <img
          src={channel.logo}
          alt={channel.name}
          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          referrerPolicy="no-referrer"
        />
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
