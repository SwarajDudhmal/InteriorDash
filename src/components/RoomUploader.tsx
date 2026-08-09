import React, { useState, useRef } from 'react';
import { CheckCircle2, RotateCcw, Camera, Compass } from 'lucide-react';
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
      
      {/* Upload Drop Zone / Image Workspace */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer ${
          selectedImage
            ? 'border-amber-500/40 bg-[#121316]'
            : isDragging
            ? 'border-amber-500 bg-amber-500/10 scale-[1.005]'
            : 'border-stone-800 hover:border-amber-600/50 bg-[#121316]/80 hover:bg-[#15161B]'
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
              alt="Architectural source photo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E11] via-transparent to-[#0D0E11]/30 opacity-80" />
            
            {/* Top Status Tag */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0E11]/85 backdrop-blur-md border border-stone-700/80 text-[11px] font-medium text-amber-300 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Architectural Source Photo Locked</span>
            </div>

            {/* Change Image Button */}
            <div className="absolute bottom-3.5 right-3.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearImage();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15161A]/90 hover:bg-rose-950 backdrop-blur-md border border-stone-700 hover:border-rose-500/50 text-xs font-medium text-stone-200 hover:text-white transition-all shadow-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replace Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-100">
                Upload Spatial Room Photo
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Drag and drop your room photography (JPG, PNG, WEBP). High-resolution daylight photos recommended.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 shadow-md transition-all"
            >
              Browse Local Files
            </button>
          </div>
        )}
      </div>

      {/* Demo Preset Rooms Carousel Bar */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Or Select an Architectural Demo Space
          </span>
          <span className="text-[10px] text-stone-500 hidden sm:inline">Instant Load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_ROOMS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectImage(sample.imageUrl, { roomType: sample.category, style: sample.recommendedStyle })}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 hover:border-amber-500/60 transition-all text-left focus:outline-none"
            >
              <img
                src={sample.imageUrl}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E11] via-[#0D0E11]/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="block text-[11px] font-serif font-bold text-stone-100 truncate">
                  {sample.name}
                </span>
                <span className="text-[9px] text-amber-300 font-mono">
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

