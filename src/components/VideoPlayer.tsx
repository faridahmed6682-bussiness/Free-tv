import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { motion } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
  embedded?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  channel, 
  onClose,
  embedded = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const proxyUrl = (url: string) => `/api/iptv/proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;

    if (!video) return;

    setError(null);
    setIsReady(false);

    // Use proxy only if normal attempt fails or if already retrying
    const streamUrl = retryCount > 0 ? proxyUrl(channel.url) : channel.url;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
        manifestLoadingMaxRetry: 4,
        levelLoadingMaxRetry: 4,
        backBufferLength: 90
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
        video.play().catch(() => {
            // Autoplay might be blocked by browser
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered");
              if (retryCount < 2) {
                 setRetryCount(prev => prev + 1);
              } else {
                 setError('Network Error: Stream unavailable');
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, trying to recover");
              hls?.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable error");
              hls?.destroy();
              setError('Stream format not supported');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support (Safari/iOS)
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsReady(true);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        if (retryCount < 2) {
             setRetryCount(prev => prev + 1);
        } else {
             setError('Playback Error');
        }
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [channel.url, retryCount]);

  // Reset retry count when channel changes
  useEffect(() => {
    setRetryCount(0);
  }, [channel.id]);

  const PlayerContent = (
    <div className="w-full h-full bg-black flex items-center justify-center relative group">
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 border-4 border-[#00a3e0] border-t-transparent rounded-full animate-spin shadow-lg"></div>
             <p className="text-[#00a3e0] text-xs font-bold tracking-widest animate-pulse">LOADING STREAM...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-sm mx-4">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h3 className="text-white font-bold text-lg mb-2">Streaming Error</h3>
           <p className="text-white/40 text-sm mb-4">{error}</p>
           <button 
             onClick={() => setRetryCount(0)}
             className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-red-600 transition-colors"
           >
             RETRY STREAM
           </button>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
        autoPlay
      />
      
      {isReady && !error && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
            </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return PlayerContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0d1117] flex flex-col"
    >
      <div className="p-4 flex justify-between items-center bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={channel.logo} alt="" className="w-8 h-8 object-contain rounded bg-white/5" />
          <div>
            <h2 className="text-sm font-bold text-white leading-none mb-1">{channel.name}</h2>
            <p className="text-[10px] text-white/40 font-mono tracking-tighter uppercase">{channel.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {PlayerContent}
      </div>
      
      <div className="p-4 bg-[#0d1117] border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
            <p className="text-white/60 text-xs leading-relaxed italic">
                Direct HLS.js streaming enabled for low latency
            </p>
        </div>
      </div>
    </motion.div>
  );
};

