import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { ScreenType } from '../types';

interface NotFoundScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export function NotFoundScreen({ onNavigate }: NotFoundScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-primary-container flex items-center justify-center mb-6 shadow-sm">
        <FileQuestion className="w-12 h-12 text-on-primary-container" />
      </div>
      <h1 className="font-serif text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-on-surface mb-2">Page Not Found</h2>
      <p className="text-on-surface-variant max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or you may have mistyped the URL.
      </p>
      <button
        onClick={() => onNavigate('auth')}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm"
      >
        <Home className="w-5 h-5" />
        Return Home
      </button>
    </div>
  );
}
