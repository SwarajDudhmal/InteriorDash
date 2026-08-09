import React, { useState, useRef, useCallback } from 'react';
import { 
  Download, 
  Copy, 
  Maximize2, 
  Columns, 
  SlidersHorizontal, 
  Check, 
  X, 
  RefreshCw,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RedesignResult, BlueprintPin } from '../types/interior';

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
  const [showBlueprintPins, setShowBlueprintPins] = useState(true);
  const [activePin, setActivePin] = useState<BlueprintPin | null>(null);
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
      a.download = `AtelierMaison_${result.roomType.replace(/\s+/g, '')}_${result.style.replace(/\s+/g, '')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {
      window.open(result.redesignedImage, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    const summary = `ATELIER MAISON Spec: ${result.roomType} in ${result.style} style (${result.colorPalette} palette, ${result.lighting} daylighting). Seed: ${result.seed}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPinBadgeColor = (category: BlueprintPin['category']) => {
    switch (category) {
      case 'Lighting': return 'bg-amber-500 text-stone-950 border-amber-300';
      case 'Structure': return 'bg-emerald-500 text-stone-950 border-emerald-300';
      case 'Material': return 'bg-sky-500 text-stone-950 border-sky-300';
      case 'Furniture': return 'bg-violet-500 text-white border-violet-300';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Top Studio Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121316] p-3 rounded-2xl border border-stone-800">
        
        {/* Architectural Title Tag */}
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
              {result.style} {result.roomType}
            </h3>
            <p className="text-[11px] text-stone-400 font-sans">
              {result.colorPalette} • {result.lighting} Lighting
            </p>
          </div>
        </div>

        {/* View Mode & Blueprint Pins Toggle Bar */}
        <div className="flex items-center gap-2">
          
          {/* Blueprint Pins Toggle */}
          <button
            type="button"
            onClick={() => setShowBlueprintPins(!showBlueprintPins)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              showBlueprintPins
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle Architect's Blueprint Annotation Pins"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Blueprint Pins</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#0D0E11] rounded-xl border border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'slider' ? 'bg-amber-800/80 text-amber-100' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'side-by-side' ? 'bg-amber-800/80 text-amber-100' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side by Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('redesigned')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'redesigned' ? 'bg-amber-800/80 text-amber-100' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Redesign Only
            </button>
          </div>

        </div>

        {/* Action Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 transition-all"
            title="Re-roll generation with new random seed"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Re-roll</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 text-xs font-serif font-bold shadow-lg shadow-amber-950/40 transition-all border border-amber-600/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Spec</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition-all"
            title="Fullscreen Studio Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Image Display Workspace */}
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
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none border border-stone-800 shadow-2xl cursor-ew-resize group"
        >
          {/* Redesigned AI Image (Underneath / Right side) */}
          <img
            src={result.redesignedImage}
            alt="AI Architectural Redesign"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Interactive Architect Blueprint Pins Overlay */}
          {showBlueprintPins && result.analysis?.blueprintPins?.map((pin) => (
            <div
              key={pin.id}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(activePin?.id === pin.id ? null : pin);
              }}
            >
              <button
                type="button"
                className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 shadow-xl cursor-pointer transition-transform hover:scale-125 ${getPinBadgeColor(pin.category)}`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="animate-ping absolute inset-0 rounded-full bg-amber-400 opacity-40"></span>
              </button>

              {/* Active Pin Popover Card */}
              {activePin?.id === pin.id && (
                <div
                  className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-[#0D0E11]/95 backdrop-blur-md border border-amber-500/50 shadow-2xl text-left text-xs z-30 animate-fadeIn space-y-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {pin.category}
                    </span>
                    <button
                      onClick={() => setActivePin(null)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-stone-100">{pin.title}</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{pin.details}</p>
                </div>
              )}
            </div>
          ))}

          <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-[#0D0E11]/85 backdrop-blur-md border border-amber-500/40 text-xs font-serif font-bold text-amber-200 shadow-lg">
            Atelier {result.style} Redesign
          </div>

          {/* Original Image (Clipped / Left side) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={result.originalImage}
              alt="Original Room Space"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: containerRef.current?.offsetWidth || '100%' }}
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#0D0E11]/85 backdrop-blur-md border border-stone-700 text-xs font-mono text-stone-300 shadow-lg">
              Original Space
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#121316] border-2 border-amber-400 shadow-2xl flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-4 h-4 rotate-90 text-amber-400" />
            </div>
          </div>

          {/* Drag Instruction Overlay */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0D0E11]/85 backdrop-blur-md text-[11px] font-mono text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-stone-800">
            Drag slider left or right to compare
          </div>
        </div>
      )}

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-800">
            <img src={result.originalImage} alt="Original Space" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0D0E11]/85 text-xs font-mono text-stone-300 border border-stone-700">
              Original Photo
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-amber-500/40">
            <img src={result.redesignedImage} alt="Redesigned Space" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0D0E11]/85 text-xs font-serif font-bold text-amber-200 border border-amber-500/40">
              Atelier Redesign ({result.style})
            </div>
          </div>
        </div>
      )}

      {viewMode === 'redesigned' && (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl">
          <img src={result.redesignedImage} alt="Redesigned Room Space" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#0D0E11]/95 backdrop-blur-xl flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 max-w-7xl mx-auto w-full">
            <h3 className="font-serif font-bold text-stone-100 text-lg">
              {result.style} {result.roomType} — Atelier Spec Full Resolution
            </h3>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={result.redesignedImage}
              alt="Fullscreen AI Room Space"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-stone-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};

