import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Info, Paintbrush } from 'lucide-react';
import { RoomType, RoomZone, RenderPhase, PaintEstimateResult, RoomDimensions } from './types';
import { getDefaultZonesForRoom } from './constants/defaultZones';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import RoomTypeSelector from './components/visualizer/RoomTypeSelector';
import SourceAsset from './components/visualizer/SourceAsset';
import InteriorCatalog from './components/catalog/InteriorCatalog';
import VisualizerCanvas from './components/visualizer/VisualizerCanvas';
import PaintEstimator from './components/estimator/PaintEstimator';
import { useAIProcessing } from './hooks/useAIProcessing';
import { downscaleImage } from './utils/image';
import { API_BASE } from './utils/apiConfig';

const App: React.FC = () => {
  const [roomType, setRoomType] = useState<RoomType>('living-room');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [zones, setZones] = useState<RoomZone[]>(getDefaultZonesForRoom('living-room'));
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(false);
  const [imageOptimizeInfo, setImageOptimizeInfo] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(100);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [renderPhase, setRenderPhase] = useState<RenderPhase>('idle');
  const [swatchPreviewHex, setSwatchPreviewHex] = useState<string | null>(null);
  const [swatchPreviewName, setSwatchPreviewName] = useState<string | null>(null);
  const [showEstimator, setShowEstimator] = useState(false);
  const [detectedDimensions, setDetectedDimensions] = useState<RoomDimensions | null>(null);

  const ai = useAIProcessing();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (ai.isQuickGenerating) {
      timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [ai.isQuickGenerating]);

  const handleRoomChange = (newRoom: RoomType) => {
    setRoomType(newRoom);
    setZones(getDefaultZonesForRoom(newRoom));
    setExpandedZoneId(null);
    setResultImage(null);
    setRenderPhase('idle');
    setShowEstimator(false);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedImage(dataUrl);
      setResultImage(null);
      setEnhancedImage(null);
      setShowEnhancePrompt(true);
      setRenderPhase('idle');
      setShowEstimator(false);
    };
    reader.readAsDataURL(file);
  };

  const handleStartOver = () => {
    if (confirm('Start over? All progress will be lost.')) {
      setSelectedImage(null);
      setResultImage(null);
      setEnhancedImage(null);
      setShowEnhancePrompt(false);
      setImageOptimizeInfo(null);
      setZones(getDefaultZonesForRoom(roomType));
      setRenderPhase('idle');
      setShowEstimator(false);
    }
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;
    ai.setIsProcessing(true);
    ai.setError(null);
    try {
      const scaled = await downscaleImage(selectedImage, 1536);
      const res = await fetch(`${API_BASE}/api/enhance-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: scaled.split(',')[1] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Optimization failed');
      if (data.enhancedImageBase64) {
        const mime = data.mimeType || 'image/png';
        setEnhancedImage(`data:${mime};base64,${data.enhancedImageBase64}`);
      }
    } catch (e: unknown) {
      ai.setError(e instanceof Error ? e.message : 'Optimization failed.');
    } finally {
      ai.setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    const enabledZones = zones.filter(z => z.enabled);
    if (enabledZones.length === 0) return;

    ai.setIsQuickGenerating(true);
    setElapsedSecs(0);
    ai.setError(null);
    setRenderPhase('painting');

    try {
      const zonePayloads = enabledZones.map(z => ({
        name: z.name,
        category: z.category,
        brand: z.selectedLine.brand,
        lineName: z.selectedLine.line,
        colorName: z.selectedColor.name,
        colorHex: z.selectedColor.hex,
        hue: z.selectedColor.hue,
        swCode: z.selectedColor.swCode || '',
        finish: z.selectedLine.profileLabel,
      }));

      const base64 = selectedImage.includes(',') ? selectedImage.split(',')[1] : selectedImage;
      const mime = selectedImage.includes(',')
        ? selectedImage.split(';')[0].split(':')[1] || 'image/png'
        : 'image/png';

      const res = await fetch(`${API_BASE}/api/paint-visualize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mime,
          roomType,
          zones: zonePayloads,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Paint visualization failed.');

      setRenderPhase('done');
      setResultImage(data.resultImage);
      if (data.estimatedDimensions) {
        setDetectedDimensions(data.estimatedDimensions);
      }
      setShowEstimator(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      ai.setError(ai.friendlyError(msg || 'Generation failed.'));
    } finally {
      ai.setIsQuickGenerating(false);
      setTimeout(() => setRenderPhase('idle'), 3000);
    }
  };

  const handleRequestQuote = (estimate: PaintEstimateResult, dimensions: RoomDimensions) => {
    // TODO: Open quote request modal / send to server
    console.log('Quote requested:', { estimate, dimensions, roomType, zones: zones.filter(z => z.enabled) });
    alert(`Quote request submitted!\n\nEstimated Total: $${estimate.totalEstimate.toLocaleString()}\n${estimate.totalGallons} gallons · ${estimate.coats} coats\n\nFishers Painting will contact you shortly.`);
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-[#E2E8F0] font-sans antialiased overflow-x-hidden">
      <Header
        hasImage={!!selectedImage}
        onStartOver={handleStartOver}
        onQuoteClick={() => setShowEstimator(true)}
        isQuoteAvailable={!!resultImage}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT PANEL — Controls */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-5">
            {/* Room Type */}
            <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-3">Room Type</h2>
              <RoomTypeSelector selectedRoom={roomType} onSelectRoom={handleRoomChange} />
            </div>

            {/* Upload */}
            <SourceAsset
              selectedImage={selectedImage}
              onUpload={handleUpload}
              showEnhancePrompt={showEnhancePrompt}
              setShowEnhancePrompt={setShowEnhancePrompt}
              isEnhancing={ai.isProcessing && !enhancedImage}
              enhancedImage={enhancedImage}
              enhanceError={ai.error}
              onEnhance={handleEnhance}
              onAcceptEnhanced={() => {
                setSelectedImage(enhancedImage);
                setEnhancedImage(null);
                setShowEnhancePrompt(false);
                setImageOptimizeInfo('Room photo optimized for visualization');
              }}
              imageOptimizeInfo={imageOptimizeInfo}
            />

            {/* Paint Color Selection */}
            <div className="rounded-xl border border-[#1E293B] overflow-hidden">
              <div className="px-5 py-3.5 bg-[#111827] border-b border-[#1E293B] flex items-center gap-3">
                <div className="w-7 h-7 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                  <Paintbrush className="w-4 h-4 text-[#10B981]" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                  Sherwin-Williams Colors
                </h2>
              </div>
              <div className="bg-[#111827] p-4">
                <InteriorCatalog
                  zones={zones}
                  setZones={setZones}
                  expandedZoneId={expandedZoneId}
                  setExpandedZoneId={setExpandedZoneId}
                  onColorMouseEnter={(c) => { setSwatchPreviewHex(c.hex); setSwatchPreviewName(c.name); }}
                  onColorMouseLeave={() => { setSwatchPreviewHex(null); setSwatchPreviewName(null); }}
                />
              </div>
            </div>

            {/* Error */}
            {ai.error && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3">
                <p className="text-[10px] text-red-400">{ai.error}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-[#0A0E17] border border-[#1E293B] rounded-lg">
              <Info className="w-3 h-3 text-[#475569] shrink-0 mt-0.5" />
              <p className="text-[8.5px] text-[#475569] leading-relaxed">
                Colors shown are digital approximations. <span className="text-[#64748B]">Always confirm with physical SW color chips before purchasing.</span>
              </p>
            </div>

            {/* Generate Button */}
            <div className="flex gap-2 mt-4">
              {resultImage && (
                <button
                  onClick={() => { setResultImage(null); setShowEstimator(false); }}
                  className="w-[120px] py-4 rounded-lg font-bold text-[#94A3B8] bg-[#1E293B] hover:bg-[#334155] hover:text-white transition-all text-[10px] tracking-widest uppercase border border-[#334155] flex flex-col items-center justify-center gap-1"
                >← Edit</button>
              )}
              <button
                disabled={ai.isQuickGenerating || !selectedImage || !zones.some(z => z.enabled)}
                onClick={handleGenerate}
                className={`flex-1 py-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all uppercase tracking-wider text-[11px] ${
                  ai.isQuickGenerating || !selectedImage || !zones.some(z => z.enabled)
                    ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed border border-[#334155]'
                    : resultImage
                      ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                }`}
              >
                {ai.isQuickGenerating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Painting...</>
                  : resultImage
                    ? <><Sparkles className="w-4 h-4" /> Re-Visualize</>
                    : <><Paintbrush className="w-4 h-4" /> Preview My Paint Colors</>}
              </button>
            </div>

            {/* Estimator — appears after visualization */}
            {showEstimator && resultImage && (
              <PaintEstimator 
                zones={zones} 
                onRequestQuote={handleRequestQuote} 
                initialDimensions={detectedDimensions || undefined} 
              />
            )}
          </div>

          {/* RIGHT PANEL — Canvas */}
          <div className="lg:col-span-8 lg:sticky lg:top-4 self-start">
            <div className="bg-[#111827] rounded-xl border border-[#1E293B] p-1 flex flex-col shadow-2xl overflow-hidden" style={{ height: 'min(calc(100vh - 100px), 900px)', minHeight: '320px' }}>
              <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Paint Preview</span>
                </div>
                <span className="text-[9px] text-[#475569]">
                  {roomType.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>

              <VisualizerCanvas
                selectedImage={selectedImage}
                resultImage={resultImage}
                isProcessing={ai.isProcessing}
                isQuickGenerating={ai.isQuickGenerating}
                sliderPos={sliderPos}
                setSliderPos={setSliderPos}
                elapsedSecs={elapsedSecs}
                renderPhase={renderPhase}
                swatchPreviewHex={swatchPreviewHex}
                swatchPreviewName={swatchPreviewName}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
