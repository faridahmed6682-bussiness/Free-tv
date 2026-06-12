import React, { useEffect, useState } from 'react';
import { Sponsor } from '../types';
import { getActiveSponsors } from '../lib/sponsorService';
import { Megaphone, ExternalLink } from 'lucide-react';

export const SponsorMarquee: React.FC = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const list = await getActiveSponsors();
                setSponsors(list);
            } catch (e) {
                console.error("Error fetching sponsors:", e);
            }
        };
        fetchSponsors();
    }, []);

    if (sponsors.length === 0) {
        return (
          <div className="w-full bg-[#121821] rounded-xl p-4 text-center border border-white/5 text-xs text-white/40 font-bold uppercase tracking-widest mb-8">
             ⚡ FREE TV SPONSORS: AD SPACE AVAILABLE
          </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-r from-[#161b22] to-[#0d1117] rounded-xl overflow-hidden mb-8 border border-white/10 shadow-lg relative group">
            <style>{`
                @keyframes marquee {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.3333%, 0, 0); }
                }
                .marquee-track {
                    display: inline-flex;
                    white-space: nowrap;
                    animation: marquee 30s linear infinite;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="absolute top-0 left-0 bg-[#ff3b3b] text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-br-lg z-10 flex items-center gap-1 uppercase select-none shadow-md">
                <Megaphone className="w-2.5 h-2.5" /> SPONSOR
            </div>

            <div className="py-4 pt-6 overflow-hidden relative w-full flex items-center min-h-[56px] select-none">
                <div className="marquee-track flex gap-12 items-center">
                    {/* Repetitive array concatenation for continuous loop */}
                    {[...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
                        <a 
                            key={`${sponsor.id}-${idx}`}
                            href={sponsor.linkUrl || undefined}
                            target={sponsor.linkUrl ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 shrink-0 cursor-pointer hover:text-[#ff3b3b] transition-colors"
                        >
                            {sponsor.imageUrl && (
                                <img 
                                    src={sponsor.imageUrl} 
                                    alt={sponsor.text} 
                                    className="h-7 w-auto object-contain rounded bg-white/5 p-0.5 max-w-[80px]" 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <span className="text-white/90 font-bold text-xs md:text-sm tracking-wide flex items-center gap-1 hover:underline">
                                {sponsor.text}
                                {sponsor.linkUrl && <ExternalLink className="w-3 h-3 opacity-50 inline" />}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};
