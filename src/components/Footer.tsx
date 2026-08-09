import React from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-16 py-8 px-4 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200 text-sm">Interior AI Studio</p>
            <p className="text-[11px] text-slate-400">
              Powered by Pollinations AI & Hugging Face Serverless
            </p>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="flex items-center gap-2 text-slate-400">
          <span>100% Free AI Room Redesign Engine</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5" /> Keyless Execution
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/siegblink/interior-designer-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <span>Inspired by siegblink</span>
          </a>
          <a
            href="https://pollinations.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
          >
            <span>Pollinations Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
};
