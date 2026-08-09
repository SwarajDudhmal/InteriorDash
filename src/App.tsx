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

import type { 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  ApiSettings, 
  GenerationStatus, 
  RedesignResult 
} from './types/interior';
import { 
  defaultApiSettings, 
  generateRoomRedesign, 
  generateRoomAnalysis 
} from './services/aiService';

export const App: React.FC = () => {
  // Application State
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

      // Generate room analysis & staging report
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans flex flex-col">
      
      {/* Header Navbar */}
      <Header
        apiSettings={apiSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Hero Title Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <span>✨ Room Layout Protection Active • 100% Free AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            AI Interior Redesigner & Customization Studio
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Upload your room photo, lock architectural structure (no extra windows!), and personalize furniture, colors, and textures with free AI.
          </p>
        </div>

        {/* Top Section: Upload & Controls Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Room Upload & Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Source Room Photo
            </h3>
            <RoomUploader
              selectedImage={selectedImage}
              onSelectImage={handleSelectImage}
              onClearImage={handleClearImage}
            />
          </div>

          {/* Right Column: Style Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Redesign Preferences & Structure Lock
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
            />
          </div>

        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bottom Section: Interactive Results & Personalization */}
        {currentResult && (
          <div ref={resultRef} className="space-y-8 pt-6 border-t border-slate-800/80">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Redesign Transformation Result</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive split slider comparison & personalized room adjustments
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setShowPersonalizer(!showPersonalizer)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
                  showPersonalizer
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                <span>{showPersonalizer ? 'Hide Personalization Studio' : '🎨 Personalize & Tweak This Room'}</span>
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

            {/* Split Comparison Slider */}
            <ImageComparisonSlider
              result={currentResult}
              onReGenerate={handleGenerate}
            />

            {/* AI Spatial & Furniture Analysis */}
            <InteriorAnalysis
              analysis={currentResult.analysis}
              styleName={currentResult.style}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* API Config Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={apiSettings}
        onSave={(newSettings) => setApiSettings(newSettings)}
      />

      {/* Saved History Drawer */}
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
