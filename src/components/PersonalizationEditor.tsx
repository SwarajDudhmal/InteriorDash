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
  'Strictly preserve walls & window count (NO extra windows)',
  'Replace sofa with green velvet sectional',
  'Keep current wooden flooring unchanged',
  'Change back wall color to warm sage paint',
  'Add large arching floor lamp in corner',
  'Remove wall clutter & simplify artwork'
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

    ctx.fillStyle = 'rgba(239, 68, 68, 0.45)'; // Semi-transparent red mask
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
    <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6 shadow-2xl shadow-indigo-950/30">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              Room Structure & Personalization Studio
            </h3>
            <p className="text-xs text-slate-400">
              Lock room architecture, choose focus areas, or paint region edits
            </p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
          Structure Control Active
        </span>
      </div>

      {/* 1. Structural Fidelity Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          1. Architectural Structure Preservation
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Strict */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('strict')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'strict'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Strict Structure Lock
              </span>
              {layoutFidelity === 'strict' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Preserves exact wall/door placement & window count. No extra windows will be created!
            </p>
          </button>

          {/* Balanced */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('balanced')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'balanced'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                Balanced Staging
              </span>
              {layoutFidelity === 'balanced' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Keeps main walls intact while allowing creative furniture rearrangement.
            </p>
          </button>

          {/* Creative */}
          <button
            type="button"
            onClick={() => setLayoutFidelity('creative')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              layoutFidelity === 'creative'
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-indigo-400" />
                Creative Freedom
              </span>
              {layoutFidelity === 'creative' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Reimagines spatial layout and architectural finishes freely.
            </p>
          </button>

        </div>
      </div>

      {/* 2. Target Redesign Focus */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          2. Target Redesign Area
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { id: 'entire-room', label: 'Entire Room', desc: 'Full redesign' },
              { id: 'furniture-only', label: 'Furniture Only', desc: 'Keep walls & floor' },
              { id: 'walls-and-floors', label: 'Walls & Floors', desc: 'Keep furniture' },
              { id: 'custom-region', label: 'Custom Paint Mask', desc: 'Target brushed area' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTargetFocus(item.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetFocus === item.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="block font-bold text-xs">{item.label}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Region Painting Mask Canvas (when custom-region selected) */}
      {targetFocus === 'custom-region' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Paintbrush className="w-4 h-4 text-rose-400" />
              <span>Paint over the area you want to replace</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Brush Size:</span>
              <input
                type="range"
                min="10"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleClearMask}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-slate-800">
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
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px] pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-xs text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                  Drag brush over room sofa, wall, or floor to mask
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Quick Personalization Tags & Instructions */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          3. Custom Personalization Requirements
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
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all"
            >
              + {tag}
            </button>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="e.g. Do not add windows. Replace couch with velvet emerald couch, keep natural oak floor..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Action CTA */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={onApplyPersonalization}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 transition-all"
      >
        <Wand2 className="w-4 h-4" />
        <span>Apply Personalization & Redesign Room</span>
      </button>

    </div>
  );
};
