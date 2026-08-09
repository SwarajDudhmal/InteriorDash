import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import type { RoomType, DesignStyle } from '../types/interior';
import { SAMPLE_ROOMS } from '../data/sampleRooms';

interface RoomUploaderProps {
  selectedImage: string | null;
  onSelectImage: (imageUrl: string, sampleInfo?: { roomType: RoomType; style: DesignStyle }) => void;
  onClearImage: () => void;
}

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  selectedImage,
  onSelectImage,
  onClearImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSelectImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone / Active Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          selectedImage
            ? 'border-indigo-500/50 bg-slate-900/60'
            : isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedImage ? (
          <div className="relative group w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl">
            <img
              src={selectedImage}
              alt="Room original upload"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
            
            {/* Top Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Room Photo Ready
            </div>

            {/* Clear/Replace overlay button */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearImage();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-600 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Upload room photo or drag & drop here
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports JPG, PNG, or WEBP. High contrast interior photos produce the best photorealistic redesigns.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              Browse Photo Files
            </button>
          </div>
        )}
      </div>

      {/* Preset Sample Rooms Bar */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Or Select a Demo Room Preset
          </span>
          <span className="text-[11px] text-slate-500">Click to load photo instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_ROOMS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectImage(sample.imageUrl, { roomType: sample.category, style: sample.recommendedStyle })}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/80 transition-all text-left focus:outline-none"
            >
              <img
                src={sample.imageUrl}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-1.5 left-2 right-2">
                <span className="block text-[11px] font-bold text-slate-100 truncate">
                  {sample.name}
                </span>
                <span className="text-[9px] text-indigo-300 font-medium">
                  {sample.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
