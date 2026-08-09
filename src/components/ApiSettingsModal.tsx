import React, { useState } from 'react';
import { X, Check, ShieldCheck, Key, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import type { ApiSettings, ApiProvider } from '../types/interior';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (newSettings: ApiSettings) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [provider, setProvider] = useState<ApiProvider>(settings.provider);
  const [pollinationsModel, setPollinationsModel] = useState<'flux' | 'flux-realism' | 'turbo'>(
    settings.pollinationsModel || 'flux-realism'
  );
  const [hfToken, setHfToken] = useState(settings.huggingFaceToken || '');
  const [customEndpoint, setCustomEndpoint] = useState(settings.customEndpointUrl || '');
  const [customKey, setCustomKey] = useState(settings.customApiKey || '');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      provider,
      pollinationsModel,
      huggingFaceToken: hfToken.trim(),
      customEndpointUrl: customEndpoint.trim(),
      customApiKey: customKey.trim(),
    });
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/90 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">AI Engine Configuration</h2>
              <p className="text-xs text-slate-400">Choose your AI provider for room redesigns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Saved Alert Banner */}
          {isSavedAlert && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}

          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select AI Engine Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Pollinations AI */}
              <button
                type="button"
                onClick={() => setProvider('pollinations')}
                className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                  provider === 'pollinations'
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    100% Free
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-100">Pollinations</span>
                <span className="text-[11px] text-slate-400 mt-1">No API key required. High speed FLUX models.</span>
              </button>

              {/* Hugging Face */}
              <button
                type="button"
                onClick={() => setProvider('huggingface')}
                className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                  provider === 'huggingface'
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                    HF Token
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-100">Hugging Face</span>
                <span className="text-[11px] text-slate-400 mt-1">Free serverless API with user token.</span>
              </button>

              {/* Custom / Replicate */}
              <button
                type="button"
                onClick={() => setProvider('custom')}
                className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                  provider === 'custom'
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    Custom
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-100">Custom / Replicate</span>
                <span className="text-[11px] text-slate-400 mt-1">Connect your own endpoint or key.</span>
              </button>

            </div>
          </div>

          {/* Provider Specific Settings */}
          {provider === 'pollinations' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Pollinations Synthesis Model</span>
              </div>
              <p className="text-xs text-slate-400">
                Pollinations provides zero-config photorealistic generation without rate limits.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['flux-realism', 'flux', 'turbo'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPollinationsModel(m)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border capitalize transition-all ${
                      pollinationsModel === m
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {provider === 'huggingface' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                Hugging Face User Access Token (Free)
              </label>
              <p className="text-xs text-slate-400">
                Create a free token at{' '}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  huggingface.co/settings/tokens
                </a>
              </p>
              <input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {provider === 'custom' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Custom Endpoint URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-custom-sdxl-api.com/generate"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={() => {
              setProvider('pollinations');
              setPollinationsModel('flux-realism');
              setHfToken('');
              setCustomEndpoint('');
              setCustomKey('');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
