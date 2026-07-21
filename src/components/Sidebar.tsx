import { ORGANISMS } from '../data';

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ selectedId, onSelect }: SidebarProps) {
  const categories = [
    'Plant Cell',
    'White Blood Cell',
    'Neuron',
    'Epithelial Cell',
    'Bacteria Cell',
    'Animal Cell',
    'Muscle Cell',
    'Fungi',
  ];

  return (
    <aside className="w-[280px] flex-shrink-0 bg-surface border-r border-surface-container-high h-[calc(100vh-89px)] overflow-y-auto sticky top-[89px]">
      <div className="p-6">
        <p className="font-mono text-xs font-semibold text-outline tracking-wider mb-2 uppercase">
          Taxonomy View
        </p>
        <h2 className="font-serif text-xl font-bold text-primary mb-6">
          CELL TYPES
        </h2>

        <div className="space-y-1">
          {categories.map((category) => {
            const org = ORGANISMS.find((o) => o.category === category);
            const isSelected = org && org.id === selectedId;
            const isFungi = category === 'Fungi';

            return (
              <button
                key={category}
                onClick={() => org && onSelect(org.id)}
                disabled={!org}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-4 transition-all ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary'
                    : 'text-on-surface hover:bg-surface-container-low border-l-4 border-transparent opacity-80 hover:opacity-100'
                } ${!org ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-surface' : 'bg-surface-container'}`}>
                  {isFungi ? (
                    <span className="text-xl">🍄</span>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{category}</div>
                  {org && (
                    <div className={`text-xs truncate ${isSelected ? 'text-on-secondary-container/80' : 'text-on-surface-variant'}`}>
                      {org.subtitle}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Organelles Section */}
        <div className="mt-8">
           <div className="flex items-center justify-between mb-4 px-2">
             <h3 className="font-mono text-xs font-semibold text-outline tracking-wider uppercase">Organelles</h3>
             <button className="text-outline hover:text-on-surface">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </button>
           </div>
           <div className="space-y-2 px-2">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 Nucleus
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                 <div className="w-2 h-2 rounded-full bg-secondary" />
                 Nucleolus
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
