import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { RoomUploader } from './components/RoomUploader';
import { DesignControls } from './components/DesignControls';
import { ImageComparisonSlider } from './components/ImageComparisonSlider';
import { InteriorAnalysis } from './components/InteriorAnalysis';
import { PersonalizationEditor } from './components/PersonalizationEditor';
import { DesignHistory } from './components/DesignHistory';
import { Footer } from './components/Footer';
import { DESIGNER_MOODBOARDS } from './data/designerMoodboards';

import type { 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  ApiSettings, 
  GenerationStatus, 
  RedesignResult,
  StudioMode
} from './types/interior';
import { 
  defaultApiSettings, 
  generateRoomRedesign, 
  generateRoomAnalysis 
} from './services/aiService';
import { Compass, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  // Application State
  const [studioMode, setStudioMode] = useState<StudioMode>('atelier');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>('Living Room');
  const [style, setStyle] = useState<DesignStyle>('Scandinavian');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('Warm Neutrals');
  const [lighting, setLighting] = useState<LightingVibe>('Golden Hour');
  const [layoutFidelity, setLayoutFidelity] = useState<LayoutFidelity>('strict');
  const [targetFocus, setTargetFocus] = useState<TargetFocus>('entire-room');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('interior_ai_settings');
    return saved ? JSON.parse(saved) : defaultApiSettings;
  });

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentResult, setCurrentResult] = useState<RedesignResult | null>(null);
  const [history, setHistory] = useState<RedesignResult[]>(() => {
    const saved = localStorage.getItem('interior_ai_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showPersonalizer, setShowPersonalizer] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Sync settings & history to localStorage
  useEffect(() => {
    localStorage.setItem('interior_ai_settings', JSON.stringify(apiSettings));
  }, [apiSettings]);

  useEffect(() => {
    localStorage.setItem('interior_ai_history', JSON.stringify(history));
  }, [history]);

  // Handle preset or file image selection
  const handleSelectImage = (imageUrl: string, sampleInfo?: { roomType: RoomType; style: DesignStyle }) => {
    setSelectedImage(imageUrl);
    if (sampleInfo) {
      setRoomType(sampleInfo.roomType);
      setStyle(sampleInfo.style);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setCurrentResult(null);
    setStatus('idle');
  };

  // Main Room Transformation Handler
  const handleGenerate = async () => {
    if (!selectedImage) return;

    setStatus('analyzing');
    setErrorMessage(null);
    setProgressStep('Analyzing room space & geometry...');

    try {
      const { redesignedUrl, seed } = await generateRoomRedesign({
        originalImage: selectedImage,
        roomType,
        style,
        colorPalette,
        lighting,
        layoutFidelity,
        targetFocus,
        customPrompt,
        settings: apiSettings,
        onProgress: (step) => setProgressStep(step),
      });

      // Generate room analysis, blueprint pins & itemized INR quotation
      const analysis = generateRoomAnalysis(roomType, style, colorPalette);

      const result: RedesignResult = {
        id: `redesign_${Date.now()}_${seed}`,
        originalImage: selectedImage,
        redesignedImage: redesignedUrl,
        roomType,
        style,
        colorPalette,
        lighting,
        layoutFidelity,
        targetFocus,
        customPrompt,
        timestamp: Date.now(),
        analysis,
        seed,
        providerUsed: apiSettings.provider,
      };

      setCurrentResult(result);
      setHistory((prev) => [result, ...prev]);
      setStatus('complete');

      // Auto scroll to comparison result smoothly
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);

    } catch (err: any) {
      console.error('Generation Error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to generate room redesign. Please try again.');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all saved redesigns?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0E11] text-stone-100 selection:bg-amber-600 selection:text-white font-sans flex flex-col">
      
      {/* Header Navbar */}
      <Header
        apiSettings={apiSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={history.length}
        studioMode={studioMode}
        onToggleStudioMode={(mode) => setStudioMode(mode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
        
        {/* Editorial Hero Title Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Structural Geometry Guard Active • Human Atelier Co-Pilot</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-100 leading-tight">
            Architectural Spaces, <span className="champagne-gradient-text italic font-normal">Co-Designed</span> with AI.
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Upload your room photography to preserve architectural boundaries, inspect tactile material swatches, generate itemized INR customer quotations, and experience human-curated virtual staging.
          </p>
        </div>

        {/* Human Designer Collections / Moodboard Carousel */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Human Designer Moodboard Collections
            </h3>
            <span className="text-[11px] text-stone-500 hidden sm:inline">Select collection to apply complete aesthetic</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DESIGNER_MOODBOARDS.map((mb) => (
              <button
                key={mb.id}
                type="button"
                onClick={() => {
                  setSelectedImage(mb.coverImage);
                  setRoomType(mb.roomType);
                  setStyle(mb.style);
                  setColorPalette(mb.colorPalette);
                  setLighting(mb.lighting);
                }}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/60 transition-all text-left focus:outline-none studio-card-hover"
              >
                <img
                  src={mb.coverImage}
                  alt={mb.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E11] via-[#0D0E11]/40 to-transparent opacity-95 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-3 left-3.5 right-3.5 space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 inline-block">
                    {mb.designer}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-100 truncate group-hover:text-amber-200 transition-colors">
                    {mb.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 line-clamp-1 italic">
                    "{mb.quote}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Section: Upload & Controls Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left Column: Room Upload & Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
              Source Room Photography
            </h3>
            <RoomUploader
              selectedImage={selectedImage}
              onSelectImage={handleSelectImage}
              onClearImage={handleClearImage}
            />
          </div>

          {/* Right Column: Style Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
              Architectural Preferences & Structure Preservation
            </h3>
            <DesignControls
              roomType={roomType}
              setRoomType={setRoomType}
              style={style}
              setStyle={setStyle}
              colorPalette={colorPalette}
              setColorPalette={setColorPalette}
              lighting={lighting}
              setLighting={setLighting}
              layoutFidelity={layoutFidelity}
              setLayoutFidelity={setLayoutFidelity}
              targetFocus={targetFocus}
              setTargetFocus={setTargetFocus}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              status={status}
              progressStep={progressStep}
              onGenerate={handleGenerate}
              isImageSelected={!!selectedImage}
              studioMode={studioMode}
            />
          </div>

        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between shadow-xl">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-stone-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bottom Section: Interactive Results, Blueprint Pins & Customer Quotation */}
        {currentResult && (
          <div ref={resultRef} className="space-y-8 pt-8 border-t border-stone-800/80">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-100 flex items-center gap-2">
                  <span>Spatial Transformation Results</span>
                </h3>
                <p className="text-xs text-stone-400 font-sans">
                  Interactive split slider comparison, Architect Blueprint Pins & Customer Quotation (INR ₹)
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setShowPersonalizer(!showPersonalizer)}
                className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all shadow-lg flex items-center gap-2 ${
                  showPersonalizer
                    ? 'bg-stone-800 text-stone-200 border border-stone-700'
                    : 'bg-amber-800 hover:bg-amber-700 text-amber-50 shadow-amber-950/40 border border-amber-600/50'
                }`}
              >
                <span>{showPersonalizer ? 'Hide Personalization Studio' : '🎨 Personalize & Tweak Directives'}</span>
              </button>
            </div>

            {/* Interactive Personalization Studio Drawer */}
            {showPersonalizer && selectedImage && (
              <PersonalizationEditor
                layoutFidelity={layoutFidelity}
                setLayoutFidelity={setLayoutFidelity}
                targetFocus={targetFocus}
                setTargetFocus={setTargetFocus}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                originalImage={selectedImage}
                onApplyPersonalization={handleGenerate}
                isGenerating={status === 'analyzing' || status === 'rendering'}
              />
            )}

            {/* Split Comparison Slider with Blueprint Pins */}
            <ImageComparisonSlider
              result={currentResult}
              onReGenerate={handleGenerate}
            />

            {/* Architectural Presentation Spec Sheet & Customer Quotation (INR ₹) */}
            <InteriorAnalysis
              analysis={currentResult.analysis}
              styleName={currentResult.style}
              roomType={currentResult.roomType}
            />

          </div>
        )}

      </main>

      {/* Studio Footer */}
      <Footer />

      {/* Engine Config Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={apiSettings}
        onSave={(newSettings) => setApiSettings(newSettings)}
      />

      {/* Saved Architectural History Drawer */}
      <DesignHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setSelectedImage(item.originalImage);
          setRoomType(item.roomType);
          setStyle(item.style);
          setColorPalette(item.colorPalette);
          setLighting(item.lighting);
          setLayoutFidelity(item.layoutFidelity || 'strict');
          setTargetFocus(item.targetFocus || 'entire-room');
          setCurrentResult(item);
        }}
        onDeleteResult={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
};

export default App;

