import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  ShoppingBag, 
  Check, 
  Copy, 
  ExternalLink, 
  Lightbulb, 
  Compass,
  FileText,
  Zap,
  Volume2,
  Receipt
} from 'lucide-react';
import type { RoomAnalysis } from '../types/interior';
import { QuotationGenerator } from './QuotationGenerator';

interface InteriorAnalysisProps {
  analysis: RoomAnalysis;
  styleName: string;
  roomType?: string;
}

export const InteriorAnalysis: React.FC<InteriorAnalysisProps> = ({
  analysis,
  styleName,
  roomType = 'Room Space'
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleCopyReport = () => {
    const reportText = `ATELIER MAISON — ARCHITECTURAL PRESENTATION SPEC SHEET
Style Aesthetic: ${styleName}
Daylighting Temperature: ${analysis.daylightKelvin}
Acoustic Rating: ${analysis.acousticScore}
Spatial Volume: ${analysis.estimatedVolume}

EXTRACTED MATERIAL PALETTE:
${analysis.dominantColors.map(c => `- ${c.name} (${c.hex}) : ${c.role}`).join('\n')}

RECOMMENDED MATERIALS:
${analysis.materials.map(m => `- ${m.name} [Finish: ${m.finish}, Origin: ${m.origin}]`).join('\n')}

FURNITURE CATALOG CONCEPTS:
${analysis.keyFurniture.map(f => `- ${f.name} (${f.estimatedPrice}) : ${f.material}`).join('\n')}

GRAND TOTAL ESTIMATE (INR): ${analysis.quotation?.formattedGrandTotal || '₹2,28,000'}

ARCHITECT DIRECTIVE:
${analysis.designNotes}

SPATIAL LAYOUT ADVICE:
${analysis.spatialAdvice}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Studio Spec Sheet Card */}
      <div className="studio-card rounded-2xl p-5 lg:p-7 space-y-7 shadow-2xl">
        
        {/* Presentation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
                Architectural Presentation Spec Sheet
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Human-curated spatial materials, lighting Kelvin ratings, and furniture specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono border border-stone-800 transition-all"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedReport ? 'Report Copied' : 'Copy Spec Report'}</span>
            </button>
            <span className="text-xs font-serif font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
              {styleName} Atelier Spec
            </span>
          </div>
        </div>

        {/* Spatial Metrics Dashboard Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#121316] border border-stone-800 text-xs">
          
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Daylighting
            </span>
            <span className="font-serif font-bold text-stone-200 block text-xs">
              {analysis.daylightKelvin || '2700K Warm Golden'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-400" /> Acoustics
            </span>
            <span className="font-serif font-bold text-stone-200 block text-xs">
              {analysis.acousticScore || 'NRC 0.78 (Optimal)'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Compass className="w-3 h-3 text-sky-400" /> Spatial Volume
            </span>
            <span className="font-serif font-bold text-stone-200 block text-xs">
              {analysis.estimatedVolume || '48.5 m³'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Receipt className="w-3 h-3 text-amber-400" /> Total Quotation
            </span>
            <span className="font-serif font-bold text-amber-300 block text-xs">
              {analysis.quotation?.formattedGrandTotal || '₹2,28,500'}
            </span>
          </div>

        </div>

        {/* Materials & Colors Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Extracted Swatches */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Curated Color Swatches & Spatial Roles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysis.dominantColors.map((swatch, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCopyHex(swatch.hex)}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-[#121316] border border-stone-800 hover:border-amber-500/50 transition-all text-xs text-left"
                  title="Click to copy HEX color"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-stone-700/80 shadow-md flex-shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div>
                      <span className="font-serif font-bold text-stone-200 block text-xs">
                        {swatch.name}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate max-w-[130px]">
                        {swatch.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-stone-400">
                    <span>{swatch.hex}</span>
                    {copiedHex === swatch.hex ? (
                      <Check className="w-3 h-3 text-emerald-400 ml-1" />
                    ) : (
                      <Copy className="w-3 h-3 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Material Inspector */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Architectural Material Inspector
            </label>
            <div className="space-y-2">
              {analysis.materials.map((mat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#121316] border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-serif font-bold text-stone-100 text-xs">{mat.name}</h4>
                    <p className="text-[10px] text-stone-400">
                      Finish: <span className="text-stone-300">{mat.finish}</span> • Origin: <span className="text-stone-300">{mat.origin}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    {mat.sustainabilityScore} Eco
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Designer Spatial Notes */}
        <div className="p-4 rounded-xl bg-[#121316] border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Architectural Director's Note</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {analysis.designNotes}
          </p>
          <p className="text-xs text-stone-400 italic pt-2 border-t border-stone-800/80">
            💡 <span className="font-mono text-stone-300">Layout Guidance:</span> {analysis.spatialAdvice}
          </p>
        </div>

        {/* Curated Furniture Concept Shopping Cards */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Curated Furniture Concept Sourcing
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {analysis.keyFurniture.map((item, idx) => (
              <a
                key={idx}
                href={`https://www.google.com/search?q=${encodeURIComponent(`${styleName} ${item.name} furniture`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-[#121316] border border-stone-800 hover:border-amber-500/50 hover:bg-[#16171C] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {item.category}
                    </span>
                    <span className="text-xs font-serif font-bold text-amber-300">
                      {item.estimatedPrice}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-stone-100 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-stone-500 font-mono">
                  Material Spec: <span className="text-stone-300">{item.material}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Customer Quotation Estimate Component (INR ₹) */}
      {analysis.quotation && (
        <QuotationGenerator
          initialQuotation={analysis.quotation}
          roomType={roomType}
          styleName={styleName}
        />
      )}

    </div>
  );
};
