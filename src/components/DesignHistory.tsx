import React from 'react';
import { X, Trash2, History, Sparkles, ArrowRight } from 'lucide-react';
import type { RedesignResult } from '../types/interior';

interface DesignHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: RedesignResult[];
  onSelectResult: (result: RedesignResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
}

export const DesignHistory: React.FC<DesignHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Saved Design Gallery</h2>
              <p className="text-xs text-slate-400">{history.length} Saved Redesigns</p>
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
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <div className="p-3 rounded-full bg-slate-800 text-slate-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400">
                No saved redesigns yet. Transform a room photo to start building your gallery!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      {item.style} • {item.roomType}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  <div
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="cursor-pointer grid grid-cols-2 gap-2 rounded-xl overflow-hidden aspect-[16/9] relative group-hover:ring-1 group-hover:ring-indigo-500/40"
                  >
                    <div className="relative h-full">
                      <img src={item.originalImage} alt="Original" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-medium text-slate-300">
                        Before
                      </span>
                    </div>
                    <div className="relative h-full">
                      <img src={item.redesignedImage} alt="AI Redesign" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-indigo-950/90 text-[9px] font-bold text-indigo-300">
                        After
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onSelectResult(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Load into Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteResult(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            >
              Clear All History
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
