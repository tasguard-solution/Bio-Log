import { useState } from 'react';
import { ORGANISMS, WAEC_CURRICULUM } from '../data';
import { ChevronDown, ChevronRight, Layers, GraduationCap } from 'lucide-react';

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ selectedId, onSelect }: SidebarProps) {
  const [viewMode, setViewMode] = useState<'taxonomy' | 'curriculum'>('curriculum');
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    'SS1 Biology': true,
    'SS2 Biology': false,
    'SS3 Biology': false,
  });

  const categories = [
    'Plant Cell',
    'White Blood Cell',
    'Neuron',
    'Epithelial Cell',
    'Bacteria Cell',
    'Animal Cell',
    'Muscle Cell',
    'Fungi',
    'Protist',
    'Plant Anatomy',
    'Organ',
    'System',
    'Molecule'
  ];

  const toggleLevel = (level: string) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <aside className="hidden md:flex w-[320px] flex-shrink-0 bg-surface border-r border-surface-container-high h-[calc(100vh-89px)] flex-col sticky top-[89px]">
      
      {/* Header & Toggle */}
      <div className="p-6 pb-4 border-b border-surface-container-high shrink-0">
        <h2 className="font-serif text-xl font-bold text-primary mb-4">
          EXPLORE MODELS
        </h2>
        
        <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <button
            onClick={() => setViewMode('curriculum')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'curriculum' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Curriculum
          </button>
          <button
            onClick={() => setViewMode('taxonomy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'taxonomy' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-4 h-4" /> Taxonomy
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* CURRICULUM VIEW */}
        {viewMode === 'curriculum' && (
          <div className="space-y-4">
            {WAEC_CURRICULUM.map((level) => (
              <div key={level.level} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
                <button 
                  onClick={() => toggleLevel(level.level)}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
                >
                  <span className="font-serif font-bold text-primary text-lg">{level.level}</span>
                  {expandedLevels[level.level] ? <ChevronDown className="w-5 h-5 text-on-surface-variant" /> : <ChevronRight className="w-5 h-5 text-on-surface-variant" />}
                </button>
                
                {expandedLevels[level.level] && (
                  <div className="p-3 space-y-4">
                    {level.topics.map((topic, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="font-mono text-[10px] font-semibold text-outline uppercase tracking-wider pl-2">
                          {topic.title}
                        </h4>
                        <div className="space-y-1">
                          {topic.organismIds.map(orgId => {
                            const org = ORGANISMS.find(o => o.id === orgId);
                            if (!org) return null;
                            const isSelected = org.id === selectedId;
                            
                            return (
                              <button
                                key={org.id}
                                onClick={() => onSelect(org.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                                  isSelected
                                    ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                                    : 'text-on-surface hover:bg-surface-container-low opacity-80 hover:opacity-100'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-surface' : 'bg-surface-container'}`}>
                                  {org.isFungiGroup ? '🍄' : <div className="w-4 h-4 rounded-full border border-outline-variant flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary rounded-full" /></div>}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">{org.name}</div>
                                  <div className={`text-[10px] truncate ${isSelected ? 'text-on-secondary-container/80' : 'text-on-surface-variant'}`}>
                                    {org.category}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAXONOMY VIEW */}
        {viewMode === 'taxonomy' && (
          <div className="space-y-1">
            {categories.map((category) => {
              // Group organisms by category
              const orgsInCategory = ORGANISMS.filter((o) => o.category === category);
              if (orgsInCategory.length === 0) return null;

              return (
                <div key={category} className="mb-4">
                  <h4 className="font-mono text-[10px] font-semibold text-outline tracking-wider uppercase pl-2 mb-2">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {orgsInCategory.map(org => {
                      const isSelected = org.id === selectedId;
                      const isFungi = category === 'Fungi';
                      
                      return (
                        <button
                          key={org.id}
                          onClick={() => onSelect(org.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary'
                              : 'text-on-surface hover:bg-surface-container-low border-l-4 border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-surface' : 'bg-surface-container'}`}>
                            {isFungi ? '🍄' : <div className="w-4 h-4 rounded-full border border-outline-variant flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary rounded-full" /></div>}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{org.name}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-on-secondary-container/80' : 'text-on-surface-variant'}`}>
                              {org.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
