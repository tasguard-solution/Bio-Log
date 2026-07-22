import { useState, useEffect, useCallback, useRef } from 'react';
import { ORGANISMS } from '../data';
import { PAST_QUESTIONS } from '../data/pastQuestions';
import { ScreenType } from '../types';
import { Search, BookOpen, Box, ClipboardList, X, ArrowRight } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectOrganism: (id: string) => void;
}

type ResultType = 'organism' | 'question';

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  action: () => void;
}

export function SearchOverlay({ isOpen, onClose, onNavigate, onSelectOrganism }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results: SearchResult[] = useCallback((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default: show all organisms up to 8
      return ORGANISMS.slice(0, 8).map(org => ({
        type: 'organism',
        id: org.id,
        title: org.name,
        subtitle: org.category,
        action: () => { onSelectOrganism(org.id); onNavigate('encyclopedia'); onClose(); },
      }));
    }

    const orgResults: SearchResult[] = ORGANISMS
      .filter(o => o.name.toLowerCase().includes(q) || o.category.toLowerCase().includes(q) || o.description.toLowerCase().includes(q))
      .slice(0, 5)
      .map(org => ({
        type: 'organism' as ResultType,
        id: org.id,
        title: org.name,
        subtitle: org.category,
        action: () => { onSelectOrganism(org.id); onNavigate('encyclopedia'); onClose(); },
      }));

    const qResults: SearchResult[] = PAST_QUESTIONS
      .filter(pq => pq.question.toLowerCase().includes(q) || pq.topic.toLowerCase().includes(q))
      .slice(0, 4)
      .map(pq => ({
        type: 'question' as ResultType,
        id: pq.id,
        title: pq.question.length > 80 ? pq.question.slice(0, 80) + '…' : pq.question,
        subtitle: `WAEC ${pq.year} · ${pq.topic}`,
        action: () => { onNavigate('past-questions'); onClose(); },
      }));

    return [...orgResults, ...qResults];
  }, [query, onSelectOrganism, onNavigate, onClose])();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      results[activeIndex]?.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-surface rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/20">
          <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search organisms, topics, WAEC questions…"
            className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant/60 text-base outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-on-surface-variant hover:text-on-surface transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-10 text-center text-on-surface-variant">
              <Search className="w-8 h-8 opacity-30 mx-auto mb-2" />
              <p className="text-sm">No results for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {!query && (
                <p className="px-5 py-2 text-xs font-mono text-outline uppercase tracking-wider">All Topics</p>
              )}
              {results.map((result, idx) => (
                <button
                  key={result.id + idx}
                  onClick={result.action}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                    idx === activeIndex ? 'bg-primary/10' : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    result.type === 'organism' ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    {result.type === 'organism'
                      ? <BookOpen className="w-4 h-4 text-primary" />
                      : <ClipboardList className="w-4 h-4 text-secondary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{result.title}</p>
                    <p className="text-xs text-on-surface-variant truncate">{result.subtitle}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${idx === activeIndex ? 'text-primary opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="border-t border-outline-variant/20 px-5 py-3 flex items-center gap-4 flex-wrap">
            <button
              onClick={() => { onNavigate('encyclopedia'); onClose(); }}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Encyclopedia
            </button>
            <button
              onClick={() => { onNavigate('visualization-hub'); onClose(); }}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <Box className="w-3.5 h-3.5" /> 3D Models
            </button>
            <button
              onClick={() => { onNavigate('past-questions'); onClose(); }}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" /> WAEC Practice
            </button>
            <span className="ml-auto text-xs text-on-surface-variant/50">↑↓ navigate · ↵ select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
