import {
  BookOpen,
  LayoutGrid,
  Library,
  Settings,
  User,
  Search,
} from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export function Header({ currentScreen, onNavigate }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-surface-container-high sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
          <div className="w-6 h-6 border-2 border-current rounded-full grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
            <div className="bg-current rounded-full" />
            <div className="bg-current rounded-full" />
            <div className="bg-current rounded-full" />
            <div className="bg-current rounded-full" />
          </div>
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary leading-tight">
            Bio Log
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            type="text"
            placeholder="Search bacteria, organelles..."
            className="w-full bg-surface-container-low border border-surface-container-highest rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
          />
        </div>
      </div>

      <nav className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('encyclopedia')}
          className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
            currentScreen === 'encyclopedia'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          Gallery
        </button>
        <button
          onClick={() => onNavigate('visualization')}
          className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
            currentScreen === 'visualization'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Library className="w-5 h-5" />
          Library
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
            currentScreen === 'admin'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Editor
        </button>
        <button
          onClick={() => onNavigate('registration')}
          className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${
            currentScreen === 'registration'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Register School
        </button>
        <div className="w-px h-6 bg-surface-container-high mx-2" />
        <button className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <User className="w-5 h-5" />
        </button>
      </nav>
    </header>
  );
}
