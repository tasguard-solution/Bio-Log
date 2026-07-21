import { ArrowLeft, Box, Download, Settings, Share2 } from 'lucide-react';
import { Organism } from '../types';

interface VisualizationScreenProps {
  organism: Organism;
  onBack: () => void;
}

export function VisualizationScreen({ organism, onBack }: VisualizationScreenProps) {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-89px)] bg-on-surface text-on-primary">
      {/* Top Bar overlay */}
      <div className="absolute top-[89px] left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
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
              Interactive 3D visualization. Use mouse or touch to rotate and zoom. Select specific organelles to view isolated structures.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
            <Settings className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
            <Box className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/80 backdrop-blur-md border border-on-primary/10 flex items-center justify-center transition-colors text-on-primary">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary-container shadow-lg flex items-center justify-center transition-colors mt-4 text-on-secondary">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Placeholder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/30 to-on-surface pointer-events-none" />
        {organism.imageUrl ? (
          <img
            src={organism.imageUrl}
            alt={organism.name}
            className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 cursor-move"
          />
        ) : (
          <div className="text-on-primary/40 font-mono flex flex-col items-center">
            <Box className="w-16 h-16 mb-4 opacity-50" />
            <p>3D Model Context Not Available for {organism.name}</p>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary/60 backdrop-blur-md border border-on-primary/10 rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto text-on-primary">
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-secondary-container transition-colors">
            <div className="w-6 h-6 rounded border-2 border-current" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Wireframe</span>
          </div>
          <div className="w-px h-8 bg-on-primary/20" />
          <div className="flex flex-col items-center gap-1 cursor-pointer text-secondary-container transition-colors">
            <div className="w-6 h-6 rounded bg-current" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Solid</span>
          </div>
          <div className="w-px h-8 bg-on-primary/20" />
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-secondary-container transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-wider">X-Ray</span>
          </div>
        </div>
      </div>
    </div>
  );
}
