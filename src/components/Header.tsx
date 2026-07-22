import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Library,
  School,
  User,
  Search,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import { ScreenType } from '../types';
import { SearchOverlay } from './SearchOverlay';
import logoUrl from '../assets/images/biolog_logo.png';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onSelectOrganism?: (id: string) => void;
  currentUser: any | null;
  userRole: 'student' | 'school_admin' | null;
  searchForceOpen?: boolean;
  onSearchClose?: () => void;
}

export function Header({ currentScreen, onNavigate, onSelectOrganism, currentUser, userRole, searchForceOpen, onSearchClose }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync with external force-open (keyboard shortcut from App)
  useEffect(() => {
    if (searchForceOpen) {
      setSearchOpen(true);
      onSearchClose?.();
    }
  }, [searchForceOpen, onSearchClose]);

  const handleCloseSearch = () => {
    setSearchOpen(false);
    onSearchClose?.();
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-surface-container-high sticky top-0 z-10">
        <button
          onClick={() => onNavigate(currentUser ? 'student-dashboard' : 'auth')}
          className="flex items-center gap-3"
        >
          <img src={logoUrl} alt="Bio Log Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary leading-tight">
              Bio Log
            </h1>
          </div>
        </button>

        {/* Search bar — only for logged-in students */}
        {currentUser && userRole === 'student' && (
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex flex-1 max-w-xs mx-8 items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface-variant hover:border-primary/30 hover:bg-surface transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search organisms, topics…</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-outline-variant/40 bg-surface-container px-1.5 font-mono text-[10px] text-on-surface-variant">
              /
            </kbd>
          </button>
        )}

        {!currentUser || userRole !== 'student' ? (
          <div className="flex-1 max-w-xl mx-12" />
        ) : null}

        <nav className="flex items-center gap-4 sm:gap-6">
          {/* Mobile search icon */}
          {currentUser && userRole === 'student' && (
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Learning resources tabs — only visible to logged-in students */}
          {currentUser && userRole === 'student' && (
            <>
              <button
                onClick={() => onNavigate('encyclopedia')}
                className={`hidden sm:flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
                  currentScreen === 'encyclopedia'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Encyclopedia
              </button>
              <button
                onClick={() => onNavigate('visualization-hub')}
                className={`hidden sm:flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
                  currentScreen === 'visualization-hub' || currentScreen === 'visualization'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Library className="w-4 h-4" />
                3D Models
              </button>
              <button
                onClick={() => onNavigate('past-questions')}
                className={`hidden sm:flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
                  currentScreen === 'past-questions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Practice
              </button>
            </>
          )}

          {/* For Schools tab — always visible */}
          <button
            onClick={() => onNavigate('registration')}
            className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
              currentScreen === 'registration'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <School className="w-4 h-4" />
            <span className="hidden sm:inline">For Schools</span>
          </button>

          <div className="w-px h-6 bg-surface-container-high mx-1" />

          {/* User avatar / login indicator */}
          <button
            onClick={() => onNavigate(currentUser
              ? userRole === 'school_admin' ? 'school-dashboard' : 'student-dashboard'
              : 'auth')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentUser
                ? 'bg-primary-container text-on-primary-container hover:bg-primary/20'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {currentUser ? (
              userRole === 'school_admin' ? <School className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {currentUser ? (userRole === 'school_admin' ? 'My School' : 'My Dashboard') : 'Log In'}
            </span>
          </button>
        </nav>
      </header>

      {/* Search overlay — portal rendered outside header */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={handleCloseSearch}
        onNavigate={onNavigate}
        onSelectOrganism={onSelectOrganism ?? (() => {})}
      />
    </>
  );
}
