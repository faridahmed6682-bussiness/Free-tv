import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, onClose }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [channel.url]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-4">
          <img src={channel.logo} alt="" className="w-10 h-10 object-contain rounded bg-white/10 pointer-events-none" />
          <div>
            <h2 className="text-xl font-bold text-white">{channel.name}</h2>
            <p className="text-sm text-white/60">{channel.category} • Live Now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <ReactPlayer
          url={channel.url}
          width="100%"
          height="100%"
          playing={isReady}
          controls
          onReady={() => setIsReady(true)}
          onError={(e) => console.error('Playback Error:', e)}
          config={{
            youtube: {
              playerVars: { showinfo: 0, rel: 0, autoplay: 1 }
            }
          }}
        />
      </div>
      
      <div className="p-6 bg-black border-t border-white/10 md:hidden">
          <p className="text-white/80 text-sm leading-relaxed">
              {channel.description || `Watching ${channel.name} Live.`}
          </p>
      </div>
    </motion.div>
  );
};
