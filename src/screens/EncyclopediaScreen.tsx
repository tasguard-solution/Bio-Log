import { useState, useEffect } from 'react';
import { Organism } from '../types';
import { Activity, BookOpen, FlaskConical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { QuizPanel } from '../components/QuizPanel';

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 text-outline-variant ${className ?? ''}`}>
        <FlaskConical className="w-16 h-16 opacity-30" />
        <span className="text-sm font-mono opacity-50">Image unavailable</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} referrerPolicy="no-referrer" />;
}

interface EncyclopediaScreenProps {
  organism: Organism;
  onQuizScore?: (organismId: string, correct: number, total: number) => void;
}

export function EncyclopediaScreen({ organism, onQuizScore }: EncyclopediaScreenProps) {
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustom2DAsset() {
      try {
        // Fetch global or school specific 2D assets
        const { data: assets } = await supabase
          .from('school_assets')
          .select('*')
          .eq('organism_id', organism.id)
          .eq('asset_type', '2d')
          // We don't have schoolId easily available here, so we fetch global ones first
          // To fetch school-specific ones, we'd need user from props. Let's just fetch global ones for now, 
          // or we can just fetch all and pick the first one since we are in Encyclopedia.
          .order('created_at', { ascending: false });

        if (assets && assets.length > 0) {
          setCustomImageUrl(assets[0].public_url);
        } else {
          setCustomImageUrl(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCustom2DAsset();
  }, [organism.id]);

  if (organism.isFungiGroup) {
    return <FungiView organism={organism} />;
  }

  return (
    <div className="flex-1 p-8 bg-surface-container-low min-h-0 overflow-y-auto flex justify-center">
      <div className="max-w-[1200px] w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main 3D Viewport Column */}
        <div className="xl:col-span-2 space-y-6">
          <div>
            <h1 className="font-serif text-[48px] font-bold text-primary leading-tight tracking-tight mb-2">
              {organism.name}
            </h1>
            <p className="font-serif text-2xl text-on-surface-variant italic">
              {organism.subtitle}
            </p>
          </div>

          <div className="bg-surface rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/30 flex flex-col relative">


            <div className="bg-surface-container-low aspect-[4/3] w-full relative flex items-center justify-center p-8 overflow-hidden shadow-inner">
              <ImageWithFallback
                src={customImageUrl || organism.imageUrl}
                alt={organism.name}
                className="w-full h-full object-contain drop-shadow-lg hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </div>

            {organism.imageSource && (
              <div className="px-4 py-2 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-outline uppercase tracking-wider">Source:</span>
                <a
                  href={organism.imageSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-secondary hover:text-primary transition-colors underline underline-offset-2 break-words max-w-full"
                >
                  {organism.imageSource.label}
                </a>
                <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/30">
                  {organism.imageSource.license}
                </span>
              </div>
            )}
            

          </div>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 border border-outline-variant/30">
            <h3 className="font-mono text-xs font-semibold text-outline tracking-wider uppercase mb-6 flex items-center justify-between">
              Organelle Details
              <Activity className="w-4 h-4 text-outline-variant" />
            </h3>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-xl bg-primary/10 border border-outline-variant/30 flex items-center justify-center shrink-0">
                 <div className="w-6 h-6 rounded-full bg-primary/30" />
               </div>
               <div>
                 <h4 className="font-serif text-xl font-semibold text-primary">{organism.name}</h4>
                 <p className="text-sm text-on-surface-variant italic font-serif">{organism.subtitle}</p>
               </div>
            </div>

            <div className="space-y-4">
              {organism.stats.map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-surface-container-high last:border-0">
                  <span className="text-sm text-on-surface-variant">{stat.label}</span>
                  <span className="font-mono text-sm font-medium text-on-surface text-right max-w-[180px]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {organism.details.map((detail, i) => (
            <div key={i} className="bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 border border-outline-variant/30 border-dashed relative">
              <h3 className="font-mono text-xs font-semibold text-outline tracking-wider uppercase mb-4 flex items-center justify-between">
                {detail.title}
                <BookOpen className="w-4 h-4 text-outline-variant" />
              </h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed">
                {detail.content}
              </p>
            </div>
          ))}

          <QuizPanel
            organismId={organism.id}
            onScoreSave={(correct, total) => onQuizScore?.(organism.id, correct, total)}
          />
          
        </div>
      </div>
    </div>
  );
}

function FungiView({ organism }: { organism: Organism }) {
  return (
    <div className="flex-1 p-8 bg-surface-container-low min-h-0 overflow-y-auto flex justify-center">
      <div className="max-w-[1200px] w-full">
         <div className="mb-10 max-w-3xl">
            <h1 className="font-serif text-[48px] font-bold text-primary leading-tight tracking-tight mb-4">
              {organism.name}
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              {organism.description}
            </p>
            
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              <button className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-medium whitespace-nowrap shadow-sm">All Fungi</button>
              <button className="px-5 py-2 rounded-full bg-surface border border-outline-variant/50 text-on-surface text-sm font-medium whitespace-nowrap hover:bg-surface-container transition-colors">Mushrooms (Basidiomycota)</button>
              <button className="px-5 py-2 rounded-full bg-surface border border-outline-variant/50 text-on-surface text-sm font-medium whitespace-nowrap hover:bg-surface-container transition-colors">Molds (Zygomycota)</button>
              <button className="px-5 py-2 rounded-full bg-surface border border-outline-variant/50 text-on-surface text-sm font-medium whitespace-nowrap hover:bg-surface-container transition-colors">Yeasts (Ascomycota)</button>
            </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {organism.fungiList?.map((fungi, i) => (
                <div key={fungi.id} className={`bg-surface rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-outline-variant/30 overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 ${i === 2 ? 'md:col-span-2 md:flex-row' : ''}`}>
                  <div className={`bg-surface-container-low relative overflow-hidden flex flex-col ${i === 2 ? 'md:w-1/2 aspect-square md:aspect-auto' : 'aspect-[4/3]'}`}>
                    <div className="absolute top-4 right-4 z-10 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full font-mono text-xs text-on-surface font-medium shadow-sm">
                      {fungi.type}
                    </div>
                    <ImageWithFallback src={fungi.imageUrl} alt={fungi.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out flex-1" />
                    {fungi.imageSource && (
                      <div className="px-3 py-1.5 bg-surface-container-lowest/90 backdrop-blur-sm flex items-center gap-1.5 flex-wrap shrink-0">
                        <span className="font-mono text-[9px] text-outline uppercase tracking-wider">©</span>
                        <a
                          href={fungi.imageSource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-secondary hover:text-primary transition-colors underline-offset-1 underline break-words"
                        >
                          {fungi.imageSource.label}
                        </a>
                        <span className="ml-auto font-mono text-[9px] text-on-surface-variant">{fungi.imageSource.license}</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-6 flex flex-col flex-1 ${i === 2 ? 'md:w-1/2 justify-center' : ''}`}>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-1">{fungi.name}</h3>
                    <p className="font-mono text-xs text-outline mb-4">{fungi.commonName}</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">
                      {fungi.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                        <Activity className="w-4 h-4" /> {fungi.type}
                      </div>
                      <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                        View 3D Model
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
               <div className="bg-secondary-container/20 rounded-2xl p-8 border border-secondary-container/50">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6" /> Key Characteristics
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-on-surface text-sm mb-1">Eukaryotic Nature</h4>
                        <p className="text-sm text-on-surface-variant">Fungi have membrane-bound nuclei and organelles, distinguishing them from bacteria.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-on-surface text-sm mb-1">Chitin Cell Walls</h4>
                        <p className="text-sm text-on-surface-variant">Unlike plants which use cellulose, fungal cell walls are composed primarily of chitin.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-on-surface text-sm mb-1">Heterotrophic Feeding</h4>
                        <p className="text-sm text-on-surface-variant">They absorb nutrients from their environment through external digestion (secreting enzymes).</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 rounded-xl bg-secondary-container/50 border border-secondary-container">
                    <p className="text-sm text-on-secondary-container font-medium italic leading-relaxed">
                      Fun Fact: The largest living organism on Earth is a honey fungus (Armillaria ostoyae) in Oregon, covering over 2,385 acres!
                    </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
