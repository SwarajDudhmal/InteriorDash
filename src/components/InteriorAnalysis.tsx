import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  ShoppingBag, 
  Check, 
  Copy, 
  ExternalLink, 
  Lightbulb, 
  Sparkles 
} from 'lucide-react';
import type { RoomAnalysis } from '../types/interior';

interface InteriorAnalysisProps {
  analysis: RoomAnalysis;
  styleName: string;
}

export const InteriorAnalysis: React.FC<InteriorAnalysisProps> = ({
  analysis,
  styleName,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6 shadow-xl shadow-slate-950/40">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-slate-100">
            Spatial Analysis & Virtual Staging Guide
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
          {styleName} AI Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Extracted Palette */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            Extracted Color Swatches
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {analysis.dominantColors.map((hex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleCopyHex(hex)}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs"
                title="Click to copy HEX color"
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-mono text-slate-300 group-hover:text-white">
                  {hex}
                </span>
                {copiedHex === hex ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Materials */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Recommended Key Materials
          </label>
          <div className="flex flex-wrap gap-2">
            {analysis.materials.map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Spatial Notes */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Designer Recommendations</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.designNotes}
        </p>
        <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800/80">
          💡 {analysis.spatialAdvice}
        </p>
      </div>

      {/* Shopping Concept Cards */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-indigo-400" />
          Curated Furniture Concept Shopping Cards
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {analysis.keyFurniture.map((item, idx) => (
            <a
              key={idx}
              href={`https://www.google.com/search?q=${encodeURIComponent(`${styleName} ${item.name} furniture`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {item.estimatedPrice}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <span>{item.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                Material: <span className="text-slate-300">{item.material}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
