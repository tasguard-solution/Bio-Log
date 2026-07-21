import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { VisualizationScreen } from './screens/VisualizationScreen';
import { AdminScreen } from './screens/AdminScreen';
import { SchoolRegistrationScreen } from './screens/SchoolRegistrationScreen';
import { SuperAdminPortal } from './screens/SuperAdminPortal';
import { ScreenType } from './types';
import { ORGANISMS } from './data';

export default function App() {
  // Setting default to registration for easy testing of the new flow
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('registration');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>(ORGANISMS[0].id);

  const selectedOrganism = ORGANISMS.find(o => o.id === selectedOrganismId) || ORGANISMS[0];

  // Check if user is accessing via /admin path or admin. subdomain
  const isAdminRoute = window.location.pathname.startsWith('/admin') || window.location.hostname.startsWith('admin.');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <SuperAdminPortal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        {currentScreen === 'encyclopedia' && (
          <>
            <Sidebar 
              selectedId={selectedOrganismId} 
              onSelect={setSelectedOrganismId} 
            />
            <EncyclopediaScreen organism={selectedOrganism} />
          </>
        )}
        
        {currentScreen === 'visualization' && (
          <VisualizationScreen 
            organism={selectedOrganism} 
            onBack={() => setCurrentScreen('encyclopedia')} 
          />
        )}
        
        {currentScreen === 'admin' && (
          <AdminScreen />
        )}

        {currentScreen === 'registration' && (
          <SchoolRegistrationScreen />
        )}

      </div>
    </div>
  );
}
