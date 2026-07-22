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
import logoUrl from '../assets/images/biolog_logo.png';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  currentUser: any | null;
  userRole: 'student' | 'school_admin' | null;
}

export function Header({ currentScreen, onNavigate, currentUser, userRole }: HeaderProps) {
  return (
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

      <div className="flex-1 max-w-xl mx-12" />

      <nav className="flex items-center gap-6">
        {/* Learning resources tabs — only visible to logged-in students */}
        {currentUser && userRole === 'student' && (
          <>
            <button
              onClick={() => onNavigate('encyclopedia')}
              className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
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
              className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
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
              className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
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
          For Schools
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
          {currentUser ? (userRole === 'school_admin' ? 'My School' : 'My Dashboard') : 'Log In'}
        </button>
      </nav>
    </header>
  );
}
