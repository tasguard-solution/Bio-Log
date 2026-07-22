import { Box } from 'lucide-react';
import { Organism, ScreenType } from '../types';
import { ORGANISMS } from '../data';

interface VisualizationHubScreenProps {
  onSelectOrganism: (organismId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export function VisualizationHubScreen({ onSelectOrganism, onNavigate }: VisualizationHubScreenProps) {
  const organismsWithModels = ORGANISMS.filter(o => o.sketchfabId && !o.isFungiGroup);

  const handleView = (organism: Organism) => {
    onSelectOrganism(organism.id);
    onNavigate('visualization');
  };

  return (
    <div className="flex-1 p-8 bg-surface-container-low min-h-0 overflow-y-auto flex justify-center">
      <div className="max-w-[1200px] w-full">
        <div className="mb-10">
          <h1 className="font-serif text-[48px] font-bold text-primary leading-tight tracking-tight mb-2">
            3D Model Gallery
          </h1>
          <p className="font-serif text-2xl text-on-surface-variant italic">
            Interactive 3D models — rotate, zoom, and explore each structure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organismsWithModels.map((organism) => (
            <button
              key={organism.id}
              onClick={() => handleView(organism)}
              className="bg-surface rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden flex flex-col text-left hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="bg-surface-container-low aspect-[4/3] w-full relative overflow-hidden flex items-center justify-center p-6">
                <img
                  src={organism.imageUrl}
                  alt={organism.name}
                  className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-on-primary text-xs font-medium shadow-sm">
                  <Box className="w-3.5 h-3.5" />
                  3D
                </div>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] text-outline uppercase tracking-wider mb-1">{organism.category}</p>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">{organism.name}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{organism.description}</p>
                <div className="mt-4 text-sm font-semibold text-primary group-hover:text-secondary transition-colors flex items-center gap-1">
                  View 3D Model →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
