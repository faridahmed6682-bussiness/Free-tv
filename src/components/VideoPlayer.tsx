import React, { useState, useEffect } from 'react';
import OriginalReactPlayer from 'react-player';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
  embedded?: boolean;
}

const ReactPlayer = (OriginalReactPlayer as any);

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  channel, 
  onClose,
  embedded = false
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsReady(false);
    setError(null);
  }, [channel.url]);

  if (embedded) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <div className="w-10 h-10 border-4 border-[#00a3e0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center p-4">
             <p className="text-red-500 font-bold mb-1">Stream Error</p>
             <p className="text-white/20 text-xs">Link restricted or broken</p>
          </div>
        )}

        {!error && (
          <ReactPlayer
            url={channel.url}
            width="100%"
            height="100%"
            playing={true}
            controls
            onReady={() => setIsReady(true)}
            onError={() => setError('Error')}
            config={{
                file: { forceHLS: true },
                youtube: { rel: 0 }
            } as any}
          />
        )}
      </div>
    );
  }

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
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Streaming Error</h3>
            <p className="text-white/40 max-w-md mx-auto mb-6">
              This channel's link might be broken or restricted. Try another channel.
            </p>
          </div>
        )}

        {!error && (
          <ReactPlayer
            url={channel.url}
            width="100%"
            height="100%"
            playing={isReady}
            controls
            onReady={() => setIsReady(true)}
            onError={() => {
              setError('Failed to load stream');
              console.error('Playback Error');
            }}
            config={{
              file: {
                forceHLS: true,
              },
              youtube: { rel: 0 }
            } as any}
          />
        )}
      </div>
      
      <div className="p-6 bg-black border-t border-white/10 md:hidden">
          <p className="text-white/80 text-sm leading-relaxed">
              {channel.description || `Watching ${channel.name} Live.`}
          </p>
      </div>
    </motion.div>
  );
};
