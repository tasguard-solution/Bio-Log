import { useState, useEffect } from 'react';
import { ArrowLeft, Box, Download, Settings, Share2, Loader2, AlertTriangle, Layers } from 'lucide-react';
import { Organism } from '../types';
import { supabase } from '../lib/supabase';

const ModelViewer = 'model-viewer' as any;

interface VisualizationScreenProps {
  user: any;
  organism: Organism;
  onBack: () => void;
}

export function VisualizationScreen({ user, organism, onBack }: VisualizationScreenProps) {
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [sketchfabId, setSketchfabId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'xray'>('solid');

  useEffect(() => {
    (async () => {
      setLoadingAssets(true);
      setModelUrl(null);
      setSketchfabId(null);

      const schoolId = user?.user_metadata?.school_id;
      if (!schoolId) {
        setLoadingAssets(false);
        return;
      }

      try {
        // Fetch custom assets for this school OR global assets (school_id is null)
        const { data: assets } = await supabase
          .from('school_assets')
          .select('*')
          .or(`school_id.eq.${schoolId},school_id.is.null`)
          .eq('organism_id', organism.id)
          .order('school_id', { ascending: false }); // Prioritize school-specific assets over global ones

        if (assets && assets.length > 0) {
          // Find sketchfab first (marked by file_path = 'sketchfab' under asset_type '3d')
          const sketchfabAsset = assets.find(a => a.asset_type === '3d' && a.file_path === 'sketchfab');
          if (sketchfabAsset) {
            setSketchfabId(sketchfabAsset.public_url);
          } else if (organism.sketchfabId) {
            setSketchfabId(organism.sketchfabId);
          } else {
            const modelAsset = assets.find(a => a.asset_type === '3d' && a.file_path !== 'sketchfab');
            if (modelAsset) setModelUrl(modelAsset.public_url);
          }
        } else if (organism.sketchfabId) {
          // If no custom assets found at all, fallback to global organism sketchfabId
          setSketchfabId(organism.sketchfabId);
        }
      } catch (err) {
        console.error('Error fetching custom assets:', err);
      } finally {
        setLoadingAssets(false);
      }
    })();
  }, [user, organism.id]);


  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-89px)] bg-on-surface text-on-primary overflow-hidden relative">
      {/* Top Bar overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-primary/70 hover:bg-primary backdrop-blur-md rounded-lg text-sm font-medium text-on-primary transition-colors border border-on-primary/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </button>

          <div className="mt-6 bg-primary/60 backdrop-blur-md rounded-xl p-6 border border-on-primary/10 max-w-sm">
            <h2 className="font-serif text-2xl font-bold mb-1 text-on-primary">{organism.name}</h2>
            <p className="font-mono text-xs text-on-primary/60 mb-4">{organism.subtitle}</p>
            <p className="text-sm text-on-primary/80 leading-relaxed">
              Interactive 3D visualization. Use mouse or touch to rotate and zoom.
            </p>
            {modelUrl && (
              <div className="mt-4 px-3 py-1.5 bg-secondary/20 text-secondary-container border border-secondary/30 rounded-lg text-xs font-medium flex items-center gap-2 w-max">
                <Box className="w-3.5 h-3.5" /> Custom 3D Model Loaded
              </div>
            )}
            {sketchfabId && (
              <div className="mt-4 px-3 py-1.5 bg-blue-500/20 text-blue-200 border border-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-2 w-max">
                <Box className="w-3.5 h-3.5" /> Sketchfab Live View
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          {(modelUrl || sketchfabId) && (
            <>
              <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
                <Settings className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
                <Layers className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
                <Share2 className="w-5 h-5" />
              </button>
              {modelUrl && (
                <button 
                  onClick={() => window.open(modelUrl, '_blank')}
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary-container shadow-lg flex items-center justify-center transition-colors mt-4 text-on-secondary"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/30 to-on-surface pointer-events-none" />
        
        {loadingAssets ? (
          <div className="flex flex-col items-center gap-4 text-on-primary/50">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-mono text-sm tracking-widest uppercase">Loading Assets...</p>
          </div>
        ) : sketchfabId ? (
          <div className="w-full h-full cursor-move pointer-events-auto z-0">
            <iframe
              title="Sketchfab Model"
              src={`https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&ui_infos=0&ui_inspector=1&ui_watermark_link=0&ui_watermark=0&ui_theme=dark`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          </div>
        ) : modelUrl ? (
          /* Render Google model-viewer for .glb files */
          <div className="w-full h-full cursor-move">
            <ModelViewer
              src={modelUrl}
              camera-controls
              auto-rotate
              ar
              shadow-intensity="1"
              style={{ width: '100%', height: '100%', outline: 'none' }}
              environment-image="neutral"
              exposure="1.2"
            >
              <div slot="progress-bar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-on-primary/50">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-mono text-sm tracking-widest uppercase text-white">Loading 3D Engine...</p>
              </div>
            </ModelViewer>
          </div>
        ) : (
          <div className="text-on-primary/40 font-mono flex flex-col items-center">
            <Box className="w-16 h-16 mb-4 opacity-50" />
            <p>3D Model not available for {organism.name}</p>
          </div>
        )}

        {/* Bottom controls (Only show if we have a model) */}
        {modelUrl && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary/60 backdrop-blur-md border border-on-primary/10 rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto text-on-primary z-10">
            <div 
              onClick={() => setViewMode('wireframe')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${viewMode === 'wireframe' ? 'text-secondary-container' : 'hover:text-secondary-container'}`}
            >
              <div className={`w-6 h-6 rounded border-2 ${viewMode === 'wireframe' ? 'border-secondary-container' : 'border-current'}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Wireframe</span>
            </div>
            <div className="w-px h-8 bg-on-primary/20" />
            <div 
              onClick={() => setViewMode('solid')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${viewMode === 'solid' ? 'text-secondary-container' : 'hover:text-secondary-container'}`}
            >
              <div className={`w-6 h-6 rounded ${viewMode === 'solid' ? 'bg-secondary-container' : 'bg-current'}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Solid</span>
            </div>
            <div className="w-px h-8 bg-on-primary/20" />
            <div 
              onClick={() => setViewMode('xray')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${viewMode === 'xray' ? 'text-secondary-container' : 'hover:text-secondary-container'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-wider">X-Ray</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
