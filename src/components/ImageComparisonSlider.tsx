import React, { useState, useRef, useCallback } from 'react';
import { 
  Download, 
  Copy, 
  Maximize2, 
  Columns, 
  SlidersHorizontal, 
  Check, 
  Sparkles, 
  X, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RedesignResult } from '../types/interior';

interface ImageComparisonSliderProps {
  result: RedesignResult;
  onReGenerate: () => void;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  result,
  onReGenerate,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'redesigned' | 'original'>('slider');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(result.redesignedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `InteriorAI_${result.roomType.replace(/\s+/g, '')}_${result.style.replace(/\s+/g, '')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      window.open(result.redesignedImage, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    const summary = `Interior AI Redesign: ${result.roomType} in ${result.style} style (${result.colorPalette} palette, ${result.lighting} lighting). Provider: ${result.providerUsed}. Seed: ${result.seed}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        
        {/* Title Badge */}
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              {result.style} {result.roomType}
            </h3>
            <p className="text-[11px] text-slate-400">
              {result.colorPalette} • {result.lighting} Lighting
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'slider' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Slider</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'side-by-side' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side by Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('redesigned')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'redesigned' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Redesign
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            title="Re-roll generation with new random seed"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Re-roll</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Fullscreen Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Image Display */}
      {viewMode === 'slider' && (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none border border-slate-800 shadow-2xl shadow-slate-950/80 cursor-ew-resize group"
        >
          {/* Redesigned AI Image (Underneath / Right side) */}
          <img
            src={result.redesignedImage}
            alt="AI Redesigned Room"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-xs font-bold text-indigo-300 shadow-lg">
            ✨ AI {result.style} Redesign
          </div>

          {/* Original Image (Clipped / Left side) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={result.originalImage}
              alt="Original Room"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: containerRef.current?.offsetWidth || '100%' }}
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-300 shadow-lg">
              Original Room
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400 rotate-90" />
            </div>
          </div>

          {/* Hint Footer Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Drag slider left or right to compare
          </div>
        </div>
      )}

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-800">
            <img src={result.originalImage} alt="Original" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-xs font-bold text-slate-300 border border-slate-700">
              Original Photo
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-indigo-500/40">
            <img src={result.redesignedImage} alt="Redesigned" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-950/80 text-xs font-bold text-indigo-300 border border-indigo-500/40">
              ✨ AI Redesign ({result.style})
            </div>
          </div>
        </div>
      )}

      {viewMode === 'redesigned' && (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl">
          <img src={result.redesignedImage} alt="Redesigned Room" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100">
              {result.style} {result.roomType} (Full Resolution)
            </h3>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={result.redesignedImage}
              alt="Fullscreen AI Room"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
