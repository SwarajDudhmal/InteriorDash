import React from 'react';
import { Compass, Settings, History, Layers, Sparkles } from 'lucide-react';
import type { ApiSettings, StudioMode } from '../types/interior';

interface HeaderProps {
  apiSettings: ApiSettings;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  studioMode: StudioMode;
  onToggleStudioMode: (mode: StudioMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiSettings,
  onOpenSettings,
  onOpenHistory,
  savedCount,
  studioMode,
  onToggleStudioMode,
}) => {
  const getProviderBadge = () => {
    switch (apiSettings.provider) {
      case 'pollinations':
        return { label: 'Spatial Vision Engine v2.4', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'huggingface':
        return { label: 'Hugging Face Model', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'custom':
        return { label: 'Custom Endpoint', color: 'bg-stone-500/10 text-stone-300 border-stone-500/30' };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0D0E11]/85 border-b border-stone-800/70 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Editorial Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-800 via-amber-900/40 to-amber-600/50 p-[1px] shadow-lg shadow-amber-950/40">
            <div className="w-full h-full bg-[#121317] rounded-[11px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-stone-100">
                ATELIER MAISON
              </h1>
              <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                STUDIO v2.4
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block font-sans tracking-tight">
              Human Spatial Architecture • Generative Vision Co-Pilot
            </p>
          </div>
        </div>

        {/* Center Mode Switcher Toggle: Atelier Mode vs Co-Pilot Mode */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#15161A] border border-stone-800 shadow-inner">
          <button
            type="button"
            onClick={() => onToggleStudioMode('atelier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              studioMode === 'atelier'
                ? 'bg-amber-900/40 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Atelier Mode: Editorial human interior design aesthetic & spatial metrics"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Atelier Studio</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleStudioMode('copilot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              studioMode === 'copilot'
                ? 'bg-stone-800 text-stone-100 border border-stone-700 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Co-Pilot Mode: Multi-model prompt synthesis & generative tweaking"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Co-Pilot</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Engine Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono ${badge.color}">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Layers className="w-3 h-3 text-amber-400" />
            <span>{badge.label}</span>
          </div>

          {/* Saved History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-200 bg-[#15161A] hover:bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all"
            title="Saved Architectural Gallery"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Portfolio</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-700 text-white text-[10px] font-mono font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* API Config Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-700/50 transition-all"
            title="Studio Settings & Engine Setup"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Engine Config</span>
          </button>

        </div>
      </div>
    </header>
  );
};

