import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { VisualizationScreen } from './screens/VisualizationScreen';
import { AdminScreen } from './screens/AdminScreen';
import { ScreenType } from './types';
import { ORGANISMS } from './data';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('encyclopedia');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>(ORGANISMS[0].id);

  const selectedOrganism = ORGANISMS.find(o => o.id === selectedOrganismId) || ORGANISMS[0];

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
      </div>
    </div>
  );
}
