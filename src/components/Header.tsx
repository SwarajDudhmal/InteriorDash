import React from 'react';
import { Sparkles, Settings, History, ExternalLink, Zap } from 'lucide-react';
import type { ApiSettings } from '../types/interior';

interface HeaderProps {
  apiSettings: ApiSettings;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  apiSettings,
  onOpenSettings,
  onOpenHistory,
  savedCount,
}) => {
  const getProviderBadge = () => {
    switch (apiSettings.provider) {
      case 'pollinations':
        return { label: '100% Free Engine', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'huggingface':
        return { label: 'Hugging Face API', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'custom':
        return { label: 'Custom Endpoint', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Interior AI Studio
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Photorealistic Room Redesign & Spatial Staging
            </p>
          </div>
        </div>

        {/* Center Engine Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${badge.color}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Zap className="w-3.5 h-3.5" />
            {badge.label}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* GitHub inspiration reference */}
          <a
            href="https://github.com/siegblink/interior-designer-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 transition-all"
            title="Inspired by siegblink/interior-designer-ai"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Open Source</span>
          </a>

          {/* Saved History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            title="Saved Designs History"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Gallery</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* API Provider Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-indigo-500/30 transition-all shadow-sm"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">API Config</span>
          </button>

        </div>
      </div>
    </header>
  );
};
