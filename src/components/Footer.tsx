import React from 'react';
import { Compass, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-800/80 bg-[#0A0B0E] mt-16 py-10 px-4 lg:px-8 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Info */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-bold text-stone-100 text-base">ATELIER MAISON STUDIO</p>
            <p className="text-[11px] text-stone-500 font-sans">
              Human Spatial Architecture Co-Pilot • Generative Spatial Vision v2.4
            </p>
          </div>
        </div>

        {/* Center Architectural Manifesto Tagline */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-stone-400 font-mono text-[11px]">
          <span>Structural Wall Guard</span>
          <span className="text-stone-700">•</span>
          <span className="flex items-center gap-1 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Human Editorial Direction
          </span>
        </div>

        {/* Studio Links */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href="https://github.com/siegblink/interior-designer-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          >
            <span>Open Source Inspiration</span>
          </a>
          <a
            href="https://pollinations.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          >
            <span>Engine Docs</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>

      </div>
    </footer>
  );
};

