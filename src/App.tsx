import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { VisualizationScreen } from './screens/VisualizationScreen';
import { AdminScreen } from './screens/AdminScreen';
import { SchoolRegistrationScreen } from './screens/SchoolRegistrationScreen';
import { SuperAdminPortal } from './screens/SuperAdminPortal';
import { AuthScreen } from './screens/AuthScreen';
import { JoinScreen } from './screens/JoinScreen';
import { StudentDashboard } from './screens/StudentDashboard';
import { ScreenType } from './types';
import { ORGANISMS } from './data';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('auth');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>(ORGANISMS[0].id);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const selectedOrganism = ORGANISMS.find(o => o.id === selectedOrganismId) || ORGANISMS[0];

  // ── Admin / Join route detection ────────────────────────────────────────────
  const isAdminRoute = window.location.pathname.startsWith('/admin') || window.location.hostname.startsWith('admin.');
  const isJoinRoute = window.location.pathname.startsWith('/join');

  // ── Session check on mount ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentScreen('student-dashboard');
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentScreen('student-dashboard');
      } else {
        setCurrentUser(null);
        setCurrentScreen('auth');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Render: Admin portal ────────────────────────────────────────────────────
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <SuperAdminPortal />
      </div>
    );
  }

  // ── Render: Student join link ───────────────────────────────────────────────
  if (isJoinRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header currentScreen="auth" onNavigate={setCurrentScreen} currentUser={null} />
        <JoinScreen
          onStudentLogin={(user) => { setCurrentUser(user); setCurrentScreen('student-dashboard'); }}
          onNavigate={setCurrentScreen}
        />
      </div>
    );
  }

  // ── Auth loading state ──────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render: Main app ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        currentUser={currentUser}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Auth / Landing */}
        {currentScreen === 'auth' && (
          <AuthScreen
            onNavigate={setCurrentScreen}
            onStudentLogin={(user) => { setCurrentUser(user); setCurrentScreen('student-dashboard'); }}
          />
        )}

        {/* Student Dashboard */}
        {currentScreen === 'student-dashboard' && currentUser && (
          <StudentDashboard
            user={currentUser}
            onNavigate={setCurrentScreen}
            onLogout={() => { setCurrentUser(null); setCurrentScreen('auth'); }}
          />
        )}

        {/* Learning resources — only for logged-in students */}
        {currentScreen === 'encyclopedia' && currentUser && (
          <>
            <Sidebar
              selectedId={selectedOrganismId}
              onSelect={setSelectedOrganismId}
            />
            <EncyclopediaScreen organism={selectedOrganism} />
          </>
        )}

        {currentScreen === 'visualization' && currentUser && (
          <VisualizationScreen
            organism={selectedOrganism}
            onBack={() => setCurrentScreen('encyclopedia')}
          />
        )}

        {/* School registration — public */}
        {currentScreen === 'registration' && (
          <SchoolRegistrationScreen />
        )}

        {/* Internal admin */}
        {currentScreen === 'admin' && (
          <AdminScreen />
        )}

        {/* Redirect to auth if trying to access protected resource without login */}
        {(currentScreen === 'encyclopedia' || currentScreen === 'visualization' || currentScreen === 'student-dashboard') && !currentUser && (
          <AuthScreen
            onNavigate={setCurrentScreen}
            onStudentLogin={(user) => { setCurrentUser(user); setCurrentScreen('student-dashboard'); }}
          />
        )}
      </div>
    </div>
  );
}
