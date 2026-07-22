import { useEffect, useState } from 'react';
import { Box, Lock, ArrowLeft } from 'lucide-react';
import { Organism, OrganismCategory, ScreenType } from '../types';
import { ORGANISMS } from '../data';
import { supabase } from '../lib/supabase';

interface VisualizationHubScreenProps {
  onSelectOrganism: (organismId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

// All categories present in the organism list (excluding fungi group)
const ALL_CATEGORY = 'All';

export function VisualizationHubScreen({ onSelectOrganism, onNavigate }: VisualizationHubScreenProps) {
  const [dbOrganismIds, setDbOrganismIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  useEffect(() => {
    (async () => {
      const { data: assets } = await supabase
        .from('school_assets')
        .select('organism_id')
        .eq('asset_type', '3d')
        .eq('file_path', 'sketchfab');

      if (assets) {
        setDbOrganismIds(new Set(assets.map(a => a.organism_id)));
      }
    })();
  }, []);

  const nonFungiOrganisms = ORGANISMS.filter(o => !o.isFungiGroup);

  const hasModel = (o: Organism) => !!(o.sketchfabId || dbOrganismIds.has(o.id));

  // Get all categories that have organisms
  const categories = [ALL_CATEGORY, ...Array.from(new Set(nonFungiOrganisms.map(o => o.category))).sort()];

  const filtered = nonFungiOrganisms.filter(o =>
    activeCategory === ALL_CATEGORY || o.category === activeCategory
  );

  const withModel = filtered.filter(o => hasModel(o));
  const withoutModel = filtered.filter(o => !hasModel(o));
  // Show all: organisms with models first, then Coming Soon
  const displayList = [...withModel, ...withoutModel];

  const handleView = (organism: Organism) => {
    if (!hasModel(organism)) return;
    onSelectOrganism(organism.id);
    onNavigate('visualization');
  };

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-[1200px] mx-auto py-8 px-4 sm:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary leading-tight tracking-tight mb-2">
            3D Model Gallery
          </h1>
          <p className="font-serif text-xl text-on-surface-variant italic">
            Interactive 3D models — rotate, zoom, and explore each structure
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-outline-variant/30 text-sm">
            <Box className="w-4 h-4 text-primary" />
            <span className="font-bold text-on-surface">{withModel.length}</span>
            <span className="text-on-surface-variant">available now</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-outline-variant/30 text-sm">
            <Lock className="w-4 h-4 text-outline" />
            <span className="font-bold text-on-surface">{nonFungiOrganisms.filter(o => !hasModel(o)).length}</span>
            <span className="text-on-surface-variant">coming soon</span>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayList.map((organism) => {
            const available = hasModel(organism);
            return (
              <button
                key={organism.id}
                onClick={() => handleView(organism)}
                disabled={!available}
                className={`group flex flex-col text-left rounded-2xl border overflow-hidden transition-all duration-300 ${
                  available
                    ? 'bg-surface border-outline-variant/30 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 active:scale-[0.98]'
                    : 'bg-surface/60 border-outline-variant/20 cursor-not-allowed opacity-70'
                }`}
              >
                {/* Image */}
                <div className="bg-surface-container-low aspect-[4/3] w-full relative overflow-hidden flex items-center justify-center p-6">
                  {organism.imageUrl ? (
                    <img
                      src={organism.imageUrl}
                      alt={organism.name}
                      className={`w-full h-full object-contain drop-shadow-lg transition-transform duration-700 ease-out ${available ? 'group-hover:scale-105' : 'grayscale opacity-60'}`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
                      <Box className="w-10 h-10 text-outline-variant" />
                    </div>
                  )}
                  {/* Badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium shadow-sm ${
                    available
                      ? 'bg-primary/80 backdrop-blur-sm text-on-primary'
                      : 'bg-surface-container-high/80 backdrop-blur-sm text-outline'
                  }`}>
                    {available ? <Box className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                    {available ? '3D' : 'Soon'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="font-mono text-[10px] text-outline uppercase tracking-wider mb-1">{organism.category}</p>
                  <h3 className="font-serif text-xl font-bold text-primary mb-1.5">{organism.name}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{organism.description}</p>
                  <div className={`mt-4 text-sm font-semibold flex items-center gap-1 transition-colors ${
                    available
                      ? 'text-primary group-hover:text-secondary'
                      : 'text-outline'
                  }`}>
                    {available ? 'View 3D Model →' : 'Coming Soon'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {displayList.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <Box className="w-12 h-12 opacity-30 mx-auto mb-3" />
            <p>No organisms in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
}
