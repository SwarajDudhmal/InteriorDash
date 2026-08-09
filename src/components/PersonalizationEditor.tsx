import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Paintbrush, 
  Layers, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Crosshair, 
  Wand2
} from 'lucide-react';
import type { LayoutFidelity, TargetFocus } from '../types/interior';

interface PersonalizationEditorProps {
  layoutFidelity: LayoutFidelity;
  setLayoutFidelity: (val: LayoutFidelity) => void;
  targetFocus: TargetFocus;
  setTargetFocus: (val: TargetFocus) => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  originalImage: string;
  onApplyPersonalization: () => void;
  isGenerating: boolean;
}

const PERSONALIZATION_TAGS = [
  'Strictly preserve structural walls & window count (NO extra windows)',
  'Replace sofa with Belgian linen sectional sofa',
  'Keep current natural timber flooring unchanged',
  'Change back wall surface to warm sage lime plaster',
  'Add arching brass floor lamp in corner',
  'Remove wall clutter & add minimalist floating oak shelf'
];

export const PersonalizationEditor: React.FC<PersonalizationEditorProps> = ({
  layoutFidelity,
  setLayoutFidelity,
  targetFocus,
  setTargetFocus,
  customPrompt,
  setCustomPrompt,
  originalImage,
  onApplyPersonalization,
  isGenerating,
}) => {
  const [brushSize, setBrushSize] = useState<number>(30);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasMaskedArea, setHasMaskedArea] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Initialize canvas overlay for region masking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasMaskedArea(false);
  }, [originalImage]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)'; // Champagne gold semi-transparent mask
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    setHasMaskedArea(true);
  };

  const handleClearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasMaskedArea(false);
    }
  };

  return (
    <div className="studio-card border-amber-600/30 rounded-2xl p-5 lg:p-6 space-y-6 shadow-2xl">
      
      {/* Presentation Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-100 flex items-center gap-2">
              Architect's Spatial Personalization Studio
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              Lock room architecture, choose focus zones, or paint region edits on room photo
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
          Structure Protection Active
        </span>
      </div>

      {/* 1. Structural Fidelity Selector */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          1. Structural Preservation Strictness
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Strict */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('strict')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'strict'
                ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-stone-100 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Strict Structure Lock
              </span>
              {layoutFidelity === 'strict' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
              Preserves exact wall/door placement & window count. No extra windows will be created!
            </p>
          </button>

          {/* Balanced */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('balanced')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'balanced'
                ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-stone-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                Balanced Staging
              </span>
              {layoutFidelity === 'balanced' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
              Keeps main walls intact while allowing creative furniture rearrangement.
            </p>
          </button>

          {/* Creative */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('creative')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'creative'
                ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-stone-100 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                Creative Freedom
              </span>
              {layoutFidelity === 'creative' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
              Reimagines spatial layout and architectural finishes freely.
            </p>
          </button>

        </div>
      </div>

      {/* 2. Target Redesign Focus */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          2. Target Redesign Zone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { id: 'entire-room', label: 'Entire Room', desc: 'Full spatial redesign' },
              { id: 'furniture-only', label: 'Furniture Only', desc: 'Keep walls & floor' },
              { id: 'walls-and-floors', label: 'Walls & Floors', desc: 'Keep seating' },
              { id: 'custom-region', label: 'Custom Region Mask', desc: 'Target painted area' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTargetFocus(item.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetFocus === item.id
                  ? 'bg-amber-900/40 border-amber-600 text-amber-100 shadow-md'
                  : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="block font-serif font-bold text-xs">{item.label}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Region Painting Mask Canvas (when custom-region selected) */}
      {targetFocus === 'custom-region' && (
        <div className="p-4 rounded-2xl bg-[#0D0E11] border border-amber-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-stone-200">
              <Paintbrush className="w-4 h-4 text-amber-400" />
              <span>Paint over room sofa, wall, or floor to isolate edit area</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-stone-400">Brush Size:</span>
              <input
                type="range"
                min="10"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleClearMask}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-stone-800">
            <img
              ref={imageRef}
              src={originalImage}
              alt="Mask canvas source"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={draw}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
            {!hasMaskedArea && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0D0E11]/40 backdrop-blur-[1px] pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-[#121316]/95 text-xs text-amber-300 font-mono border border-amber-500/30 flex items-center gap-1.5 shadow-xl">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  Drag brush over specific furniture or surface to mask
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Quick Architectural Tags & Directives */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          3. Custom Personalization Directive
        </label>
        
        {/* Quick Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PERSONALIZATION_TAGS.map((tag, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const current = customPrompt ? `${customPrompt}; ${tag}` : tag;
                setCustomPrompt(current);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0D0E11] hover:bg-amber-950/60 border border-stone-800 hover:border-amber-600/40 text-stone-300 hover:text-amber-200 transition-all font-sans"
            >
              + {tag}
            </button>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="e.g. Do not alter window count. Replace sofa with Belgian linen sectional, keep natural ash floor..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0E11] border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 font-sans"
        />
      </div>

      {/* Action CTA */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={onApplyPersonalization}
        className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 text-white bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 shadow-xl shadow-amber-950/50 border border-amber-500/40 transition-all"
      >
        <Wand2 className="w-4 h-4" />
        <span>Apply Personalization Directives & Render Space</span>
      </button>

    </div>
  );
};

