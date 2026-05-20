import React, { useRef } from 'react';
import { Upload, Camera, Sparkles, Loader2 } from 'lucide-react';

interface SourceAssetProps {
  selectedImage: string | null;
  onUpload: (file: File) => void;
  showEnhancePrompt: boolean;
  setShowEnhancePrompt: (show: boolean) => void;
  isEnhancing: boolean;
  enhancedImage: string | null;
  enhanceError: string | null;
  onEnhance: () => void;
  onAcceptEnhanced: () => void;
  imageOptimizeInfo: string | null;
}

const SourceAsset: React.FC<SourceAssetProps> = ({
  selectedImage,
  onUpload,
  showEnhancePrompt,
  setShowEnhancePrompt,
  isEnhancing,
  enhancedImage,
  enhanceError,
  onEnhance,
  onAcceptEnhanced,
  imageOptimizeInfo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) onUpload(e.dataTransfer.files[0]);
  };

  return (
    <div className="rounded-xl border border-[#1E293B] overflow-hidden bg-[#111827]">
      <div className="p-4">
        {!selectedImage ? (
          /* Upload area */
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-[#334155] hover:border-[#10B981]/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
            >
              <Upload className="w-10 h-10 text-[#475569] group-hover:text-[#3B82F6] mx-auto mb-3 transition-colors" />
              <p className="text-sm font-bold text-[#94A3B8] group-hover:text-[#E2E8F0] mb-1 transition-colors">
                Upload Room Photo
              </p>
              <p className="text-[10px] text-[#475569]">
                Drag & drop or click to browse
              </p>
              <p className="text-[9px] text-[#334155] mt-2">
                JPG, PNG, WebP — max 20MB
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E293B]">
              <p className="text-[10px] text-[#64748B] mb-2 font-bold uppercase tracking-wider">Try a Sample Room</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Kitchen', url: `${import.meta.env.BASE_URL}samples/kitchen.png` },
                  { name: 'Bathroom', url: `${import.meta.env.BASE_URL}samples/bathroom.png` },
                  { name: 'Living Room', url: `${import.meta.env.BASE_URL}samples/living_room.png` },
                  { name: 'Bedroom', url: `${import.meta.env.BASE_URL}samples/bedroom.png` }
                ].map((sample) => (
                  <button
                    key={sample.name}
                    onClick={async () => {
                      try {
                        const res = await fetch(sample.url);
                        const blob = await res.blob();
                        const file = new File([blob], `${sample.name}.png`, { type: blob.type });
                        onUpload(file);
                      } catch (e) {
                        console.error('Failed to load sample', e);
                      }
                    }}
                    className="group relative rounded-lg overflow-hidden border border-[#334155] hover:border-[#10B981] transition-all aspect-video"
                    title={`Try ${sample.name}`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-1">
                      <span className="text-[8px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">{sample.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (

          /* Image loaded — thumbnail & enhance prompt */
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#334155] shrink-0">
                <img
                  src={selectedImage}
                  alt="Room preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#E2E8F0] truncate">
                  Room Photo Loaded
                </p>
                {imageOptimizeInfo && (
                  <p className="text-[9px] text-[#10B981] mt-0.5">✓ {imageOptimizeInfo}</p>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 text-[9px] font-bold text-[#64748B] hover:text-[#94A3B8] bg-[#1E293B] hover:bg-[#334155] rounded transition-colors"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* AI Enhance prompt */}
            {showEnhancePrompt && !enhancedImage && (
              <div className="bg-[#0A0E17] border border-[#1E293B] rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-[#E2E8F0] mb-1">
                      Optimize for AI?
                    </p>
                    <p className="text-[9px] text-[#64748B] mb-2">
                      Remove clutter and optimize lighting for best results
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={onEnhance}
                        disabled={isEnhancing}
                        className="px-3 py-1.5 text-[9px] font-bold bg-[#F59E0B] hover:bg-[#D97706] text-black rounded transition-colors flex items-center gap-1"
                      >
                        {isEnhancing ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Optimizing...</>
                        ) : (
                          <><Sparkles className="w-3 h-3" /> Optimize</>
                        )}
                      </button>
                      <button
                        onClick={() => setShowEnhancePrompt(false)}
                        className="px-2 py-1.5 text-[9px] font-bold text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                    {enhanceError && (
                      <p className="text-[9px] text-red-400 mt-1">{enhanceError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced image comparison */}
            {enhancedImage && (
              <div className="bg-[#0A0E17] border border-[#10B981]/30 rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#10B981] mb-2">✓ Image Optimized</p>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 rounded overflow-hidden border border-[#334155]">
                    <img src={selectedImage} alt="Original" className="w-full h-20 object-cover" />
                    <p className="text-[8px] text-center text-[#64748B] py-0.5">Original</p>
                  </div>
                  <div className="flex-1 rounded overflow-hidden border border-[#10B981]/30">
                    <img src={enhancedImage} alt="Enhanced" className="w-full h-20 object-cover" />
                    <p className="text-[8px] text-center text-[#10B981] py-0.5">Optimized</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onAcceptEnhanced}
                    className="flex-1 py-1.5 text-[9px] font-bold bg-[#10B981] hover:bg-[#059669] text-white rounded transition-colors"
                  >
                    Use Optimized
                  </button>
                  <button
                    onClick={() => setShowEnhancePrompt(false)}
                    className="px-3 py-1.5 text-[9px] font-bold text-[#64748B] hover:text-[#94A3B8] bg-[#1E293B] rounded transition-colors"
                  >
                    Keep Original
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onUpload(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default SourceAsset;
