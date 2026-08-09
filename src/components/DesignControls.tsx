import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Palette, 
  Sun, 
  Wand2, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Check,
  Layers,
  ShieldCheck
} from 'lucide-react';
import type { 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  GenerationStatus,
  StudioMode
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
  studioMode?: StudioMode;
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

const DESIGN_STYLES: { name: DesignStyle; tag: string; origin: string }[] = [
  { name: 'Modern Minimalist', tag: 'Sleek Lines & Concealed Storage', origin: 'Milan, Italy' },
  { name: 'Scandinavian', tag: 'Cozy Light Ash & Wool Textiles', origin: 'Stockholm, Sweden' },
  { name: 'Japandi', tag: 'Wabi-Sabi & Hinoki Wood', origin: 'Kyoto, Japan' },
  { name: 'Industrial Loft', tag: 'Reclaimed Brick & Black Steel', origin: 'New York, USA' },
  { name: 'Bohemian Chic', tag: 'Layered Rattan & Botanical Greenery', origin: 'Oaxaca, Mexico' },
  { name: 'Mid-Century Modern', tag: 'American Walnut & Tapered Peg Legs', origin: 'Palm Springs, USA' },
  { name: 'Coastal Beach', tag: 'Breezy Linen & Sun-washed Driftwood', origin: 'Hamptons, USA' },
  { name: 'Cyberpunk Neon', tag: 'Smoked Glass & Ambient Neon LED', origin: 'Tokyo, Japan' },
  { name: 'Luxury Neoclassic', tag: 'Crown Moldings & Carrara Marble', origin: 'Paris, France' },
  { name: 'Mediterranean', tag: 'Whitewashed Plaster & Terracotta', origin: 'Amalfi, Italy' },
  { name: 'Art Deco', tag: 'Geometric Gold Inlay & Shell Chairs', origin: 'Vienna, Austria' },
  { name: 'Rustic Farmhouse', tag: 'Rough-sawn Barnwood & Hearth', origin: 'Vermont, USA' }
];

const COLOR_PALETTES: { name: ColorPalette; swatches: { hex: string; label: string }[] }[] = [
  { 
    name: 'Warm Neutrals', 
    swatches: [
      { hex: '#F5EBE0', label: 'Warm Oat' },
      { hex: '#E3D5CA', label: 'Sandstone' },
      { hex: '#D5BDAF', label: 'Taupe' },
      { hex: '#B5927B', label: 'Natural Ash' }
    ]
  },
  { 
    name: 'Emerald & Gold', 
    swatches: [
      { hex: '#064E3B', label: 'Royal Emerald' },
      { hex: '#047857', label: 'Forest' },
      { hex: '#D97706', label: 'Brass Gold' },
      { hex: '#FEF3C7', label: 'Champagne' }
    ]
  },
  { 
    name: 'Terracotta & Sage', 
    swatches: [
      { hex: '#C2410C', label: 'Terracotta' },
      { hex: '#EA580C', label: 'Sun Clay' },
      { hex: '#84CC16', label: 'Sage' },
      { hex: '#4D7C0F', label: 'Olive' }
    ]
  },
  { 
    name: 'Charcoal & Marble', 
    swatches: [
      { hex: '#111827', label: 'Obsidian' },
      { hex: '#374151', label: 'Graphite' },
      { hex: '#9CA3AF', label: 'Aluminum' },
      { hex: '#F3F4F6', label: 'White Marble' }
    ]
  },
  { 
    name: 'Pastel Dream', 
    swatches: [
      { hex: '#FCE7F3', label: 'Blush' },
      { hex: '#E0E7FF', label: 'Periwinkle' },
      { hex: '#FEF3C7', label: 'Vanilla' },
      { hex: '#D1FAE5', label: 'Mint' }
    ]
  },
  { 
    name: 'Monochromatic Dark', 
    swatches: [
      { hex: '#030712', label: 'Midnight' },
      { hex: '#111827', label: 'Charcoal' },
      { hex: '#1F2937', label: 'Smoked Oak' },
      { hex: '#374151', label: 'Iron' }
    ]
  },
  { 
    name: 'Boho Earth', 
    swatches: [
      { hex: '#B45309', label: 'Raw Ochre' },
      { hex: '#D97706', label: 'Amber' },
      { hex: '#A16207', label: 'Mustard' },
      { hex: '#78350F', label: 'Walnut' }
    ]
  }
];

const LIGHTING_VIBES: { name: LightingVibe; desc: string; kelvin: string }[] = [
  { name: 'Golden Hour', desc: 'Warm streaming sunlight (2700K)', kelvin: '2700K' },
  { name: 'Daylight', desc: 'Crisp clear morning daylight (4000K)', kelvin: '4000K' },
  { name: 'Warm Ambient', desc: 'Cozy evening lamps & cove glow (3000K)', kelvin: '3000K' },
  { name: 'Mood Dim', desc: 'Cinematic focused spotlights (2400K)', kelvin: '2400K' },
  { name: 'Cyber Neon', desc: 'RGB ambient glow & deep contrast', kelvin: '4500K' }
];

const ARCHITECTURAL_DIRECTIVES = [
  'Preserve structural walls & window count (NO extra windows)',
  'Add fluted oak acoustic slatted feature wall',
  'Keep current natural timber flooring unchanged',
  'Replace sofa with Belgian linen sectional sofa',
  'Incorporate low-profile minimalist coffee table',
  'Add arching brass floor lamp in corner'
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
  studioMode = 'atelier'
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isGenerating = status === 'analyzing' || status === 'rendering';

  return (
    <div className="studio-card rounded-2xl p-5 lg:p-6 space-y-6 shadow-2xl">
      
      {/* Structural Preservation Gauge Bar */}
      <div className="p-3.5 rounded-xl bg-[#15161A] border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-200 block">
              Architectural Structure Protection
            </span>
            <p className="text-[11px] text-stone-400">Lock structural walls & preserve exact window count</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            {studioMode === 'atelier' ? '🏛️ Atelier Mode' : '⚡ AI Co-Pilot'}
          </span>
          <div className="flex items-center gap-1 bg-[#0D0E11] p-1 rounded-lg border border-stone-800 text-xs font-medium">
            {(['strict', 'balanced', 'creative'] as const).map((fid) => (
              <button
                key={fid}
                type="button"
                onClick={() => setLayoutFidelity(fid)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  layoutFidelity === fid
                    ? 'bg-amber-800/80 text-amber-100 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {fid}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Room Space Selection */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
          <Home className="w-4 h-4 text-amber-400" />
          1. Select Spatial Room Category
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setRoomType(rt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                roomType === rt
                  ? 'bg-amber-900/40 border-amber-600/60 text-amber-200 shadow-md shadow-amber-950/40 font-semibold'
                  : 'bg-[#121316] border-stone-800/80 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Architectural Aesthetic Grid */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          2. Architectural Aesthetic Style
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
                    ? 'bg-[#1C1D22] border-amber-500 text-stone-100 ring-1 ring-amber-500/30 shadow-lg shadow-black/60'
                    : 'bg-[#121316] border-stone-800/80 hover:border-stone-700 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-serif font-bold text-xs text-stone-100">{st.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 block truncate">
                  {st.tag}
                </span>
                <span className="text-[9px] text-amber-400/70 font-mono block mt-1">
                  {st.origin}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Targeted Redesign Focus */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          3. Targeted Redesign Zone
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'entire-room', label: 'Full Room Staging' },
              { id: 'furniture-only', label: 'Furniture Only' },
              { id: 'walls-and-floors', label: 'Walls & Flooring' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTargetFocus(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                targetFocus === item.id
                  ? 'bg-amber-900/40 border-amber-600/60 text-amber-200 shadow-md'
                  : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Material Color Swatches & Lighting Atmosphere */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-stone-800/70">
        
        {/* Material Color Palette Swatches */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            4. Tactile Material Palette
          </label>
          <div className="space-y-2">
            {COLOR_PALETTES.map((cp) => (
              <button
                key={cp.name}
                type="button"
                onClick={() => setColorPalette(cp.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs transition-all ${
                  colorPalette === cp.name
                    ? 'bg-[#18191E] border-amber-500/80 text-stone-100 ring-1 ring-amber-500/30'
                    : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="font-serif font-bold text-stone-200">{cp.name}</span>
                <div className="flex items-center gap-1.5">
                  {cp.swatches.map((sw, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-stone-700/80 shadow-sm"
                      style={{ backgroundColor: sw.hex }}
                      title={`${sw.label} (${sw.hex})`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Daylighting Atmosphere */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            5. Daylighting & Kelvin Rating
          </label>
          <div className="grid grid-cols-1 gap-2">
            {LIGHTING_VIBES.map((lv) => (
              <button
                key={lv.name}
                type="button"
                onClick={() => setLighting(lv.name)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs border text-left transition-all ${
                  lighting === lv.name
                    ? 'bg-amber-950/40 border-amber-600/70 text-amber-200'
                    : 'bg-[#121316] border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div>
                  <span className="font-medium block text-stone-200">{lv.name}</span>
                  <span className="text-[10px] text-stone-400">{lv.desc}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300">
                  {lv.kelvin}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Custom Architectural Directives Accordion */}
      <div className="border-t border-stone-800/70 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-stone-200 transition-all py-1"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Architectural Directives & Spec Customization (Optional)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            <textarea
              rows={2}
              placeholder="e.g. Do not add extra windows. Replace sofa with Belgian linen sectional, add slatted oak feature wall..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0E11] border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 font-sans"
            />
            
            {/* Quick Directive Pills */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-stone-500 font-mono uppercase">Directives:</span>
              {ARCHITECTURAL_DIRECTIVES.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const current = customPrompt ? `${customPrompt}; ${sug}` : sug;
                    setCustomPrompt(current);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-[#0D0E11] hover:bg-amber-950/50 border border-stone-800 hover:border-amber-600/40 text-stone-400 hover:text-amber-200 transition-all"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Generate Redesign Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!isImageSelected || isGenerating}
          onClick={onGenerate}
          className={`w-full py-4 px-6 rounded-2xl font-serif font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all shadow-2xl ${
            !isImageSelected
              ? 'bg-stone-800/80 text-stone-500 cursor-not-allowed border border-stone-700/50'
              : isGenerating
              ? 'bg-amber-900/60 text-amber-200 cursor-wait border border-amber-600/50'
              : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-white shadow-amber-950/50 hover:scale-[1.005] active:scale-[0.995] border border-amber-500/50'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-200" />
              <span>{progressStep || 'Synthesizing Spatial Redesign...'}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Redesign {roomType} in {style} Aesthetic</span>
            </>
          )}
        </button>

        {!isImageSelected && (
          <p className="text-center text-xs text-amber-400/80 mt-2 font-mono">
            Please upload a room photo or click a demo room preset above to generate.
          </p>
        )}
      </div>

    </div>
  );
};

