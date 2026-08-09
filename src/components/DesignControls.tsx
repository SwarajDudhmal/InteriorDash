import React, { useState } from 'react';
import { 
  Sparkles, 
  Home, 
  Palette, 
  Sun, 
  Wand2, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Check,
  Lock,
  Layers
} from 'lucide-react';
import type { 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  GenerationStatus 
} from '../types/interior';

interface DesignControlsProps {
  roomType: RoomType;
  setRoomType: (val: RoomType) => void;
  style: DesignStyle;
  setStyle: (val: DesignStyle) => void;
  colorPalette: ColorPalette;
  setColorPalette: (val: ColorPalette) => void;
  lighting: LightingVibe;
  setLighting: (val: LightingVibe) => void;
  layoutFidelity: LayoutFidelity;
  setLayoutFidelity: (val: LayoutFidelity) => void;
  targetFocus: TargetFocus;
  setTargetFocus: (val: TargetFocus) => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  status: GenerationStatus;
  progressStep: string;
  onGenerate: () => void;
  isImageSelected: boolean;
}

const ROOM_TYPES: RoomType[] = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Home Office',
  'Bathroom',
  'Gaming Room',
  'Patio / Balcony',
  'Walk-in Closet',
  'Nursery'
];

const DESIGN_STYLES: { name: DesignStyle; tag: string; bgGradient: string }[] = [
  { name: 'Modern Minimalist', tag: 'Sleek & Uncluttered', bgGradient: 'from-slate-700 to-slate-900' },
  { name: 'Scandinavian', tag: 'Cozy Light Wood', bgGradient: 'from-amber-700 to-stone-900' },
  { name: 'Japandi', tag: 'Zen & Wabi-Sabi', bgGradient: 'from-stone-600 to-neutral-900' },
  { name: 'Industrial Loft', tag: 'Raw Brick & Steel', bgGradient: 'from-zinc-800 to-stone-950' },
  { name: 'Bohemian Chic', tag: 'Earthy & Plant-filled', bgGradient: 'from-orange-800 to-yellow-950' },
  { name: 'Mid-Century Modern', tag: 'Teak & Retro Curves', bgGradient: 'from-amber-800 to-amber-950' },
  { name: 'Coastal Beach', tag: 'Airy Blue & Driftwood', bgGradient: 'from-sky-800 to-slate-900' },
  { name: 'Cyberpunk Neon', tag: 'Futuristic Glow', bgGradient: 'from-fuchsia-900 to-cyan-950' },
  { name: 'Luxury Neoclassic', tag: 'Marble & Gold Leaf', bgGradient: 'from-yellow-900 to-slate-950' },
  { name: 'Mediterranean', tag: 'Terracotta & Plaster', bgGradient: 'from-orange-900 to-stone-900' },
  { name: 'Art Deco', tag: 'Glamorous Sunburst', bgGradient: 'from-emerald-900 to-slate-950' },
  { name: 'Rustic Farmhouse', tag: 'Barnwood & Hearth', bgGradient: 'from-amber-900 to-stone-950' }
];

const COLOR_PALETTES: { name: ColorPalette; swatches: string[] }[] = [
  { name: 'Warm Neutrals', swatches: ['#F5EBE0', '#E3D5CA', '#D5BDAF', '#B5927B'] },
  { name: 'Emerald & Gold', swatches: ['#064E3B', '#047857', '#D97706', '#FEF3C7'] },
  { name: 'Terracotta & Sage', swatches: ['#C2410C', '#EA580C', '#84CC16', '#4D7C0F'] },
  { name: 'Charcoal & Marble', swatches: ['#111827', '#374151', '#9CA3AF', '#F3F4F6'] },
  { name: 'Pastel Dream', swatches: ['#FCE7F3', '#E0E7FF', '#FEF3C7', '#D1FAE5'] },
  { name: 'Monochromatic Dark', swatches: ['#030712', '#111827', '#1F2937', '#374151'] },
  { name: 'Boho Earth', swatches: ['#B45309', '#D97706', '#A16207', '#78350F'] }
];

const LIGHTING_VIBES: LightingVibe[] = [
  'Golden Hour',
  'Daylight',
  'Warm Ambient',
  'Mood Dim',
  'Cyber Neon'
];

const PROMPT_SUGGESTIONS = [
  'Do not add extra windows',
  'Add large fiddle leaf fig plant',
  'Keep wooden floor unchanged',
  'Replace sofa with deep emerald velvet sectional',
  'Add fluted oak slatted feature wall'
];

export const DesignControls: React.FC<DesignControlsProps> = ({
  roomType,
  setRoomType,
  style,
  setStyle,
  colorPalette,
  setColorPalette,
  lighting,
  setLighting,
  layoutFidelity,
  setLayoutFidelity,
  targetFocus,
  setTargetFocus,
  customPrompt,
  setCustomPrompt,
  status,
  progressStep,
  onGenerate,
  isImageSelected,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isGenerating = status === 'analyzing' || status === 'rendering';

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6 shadow-xl shadow-slate-950/50">
      
      {/* Structural Preservation Bar */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-xs font-bold text-slate-200">Room Layout Protection</span>
            <p className="text-[11px] text-slate-400">Lock window/door count & wall positions</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          {(['strict', 'balanced', 'creative'] as const).map((fid) => (
            <button
              key={fid}
              type="button"
              onClick={() => setLayoutFidelity(fid)}
              className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                layoutFidelity === fid
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {fid}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Room Type Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
          <Home className="w-4 h-4 text-indigo-400" />
          1. Select Room Space
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setRoomType(rt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                roomType === rt
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Design Style Selector Grid */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          2. Choose Interior Aesthetic
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {DESIGN_STYLES.map((st) => {
            const isSelected = style === st.name;
            return (
              <button
                key={st.name}
                type="button"
                onClick={() => setStyle(st.name)}
                className={`relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-slate-100">{st.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  {st.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Target Element Focus */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          3. Targeted Redesign Area
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'entire-room', label: 'Full Room' },
              { id: 'furniture-only', label: 'Furniture Only' },
              { id: 'walls-and-floors', label: 'Walls & Floors' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTargetFocus(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                targetFocus === item.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Color Palette & Lighting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/70">
        
        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            4. Color Scheme
          </label>
          <div className="space-y-2">
            {COLOR_PALETTES.map((cp) => (
              <button
                key={cp.name}
                type="button"
                onClick={() => setColorPalette(cp.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                  colorPalette === cp.name
                    ? 'bg-slate-900 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-semibold text-slate-200">{cp.name}</span>
                <div className="flex items-center gap-1">
                  {cp.swatches.map((hex, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-slate-800 shadow-sm"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Vibe */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            5. Lighting Atmosphere
          </label>
          <div className="grid grid-cols-1 gap-2">
            {LIGHTING_VIBES.map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setLighting(lv)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  lighting === lv
                    ? 'bg-amber-500/15 border-amber-500/80 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Custom Personalization Accordion */}
      <div className="border-t border-slate-800/70 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-all py-1"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Personalization & Custom Directives (Optional)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            <textarea
              rows={2}
              placeholder="e.g. Do not add extra windows. Change sofa to green velvet, add floating oak shelves..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            
            {/* Quick Suggestion Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Ideas:</span>
              {PROMPT_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const current = customPrompt ? `${customPrompt}; ${sug}` : sug;
                    setCustomPrompt(current);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 transition-all"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Generate CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!isImageSelected || isGenerating}
          onClick={onGenerate}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl ${
            !isImageSelected
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : isGenerating
              ? 'bg-indigo-700 text-indigo-100 cursor-wait'
              : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-indigo-200" />
              <span>{progressStep || 'Redesigning Space with AI...'}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Transform {roomType} into {style}</span>
            </>
          )}
        </button>

        {!isImageSelected && (
          <p className="text-center text-xs text-amber-400/80 mt-2">
            Please upload a room photo or click a demo room preset above to generate.
          </p>
        )}
      </div>

    </div>
  );
};
