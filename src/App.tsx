import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EncyclopediaScreen } from './screens/EncyclopediaScreen';
import { VisualizationScreen } from './screens/VisualizationScreen';
import { VisualizationHubScreen } from './screens/VisualizationHubScreen';
import { AdminScreen } from './screens/AdminScreen';
import { SchoolRegistrationScreen } from './screens/SchoolRegistrationScreen';
import { SuperAdminPortal } from './screens/SuperAdminPortal';
import { AuthScreen } from './screens/AuthScreen';
import { JoinScreen } from './screens/JoinScreen';
import { StudentDashboard } from './screens/StudentDashboard';
import { SchoolAdminDashboard } from './screens/SchoolAdminDashboard';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { PastQuestionsScreen } from './screens/PastQuestionsScreen';
import { TeacherWebinar } from './screens/TeacherWebinar';
import { StudentWebinar } from './screens/StudentWebinar';
import { TeacherQuizBuilder } from './screens/TeacherQuizBuilder';
import { StudentAssignmentsScreen } from './screens/StudentAssignmentsScreen';
import { ScreenType } from './types';
import { ORGANISMS } from './data';
import { supabase } from './lib/supabase';

type UserRole = 'student' | 'school_admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('auth');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>(ORGANISMS[0].id);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginMode, setLoginMode] = useState<'free' | 'demo' | 'locked'>(() => {
    const stored = localStorage.getItem('biolog_login_mode');
    if (stored === 'free' || stored === 'locked') return stored;
    return 'demo'; // Universal default for judges
  });
  const [visualizationSource, setVisualizationSource] = useState<'hub' | 'encyclopedia'>('hub');

  const updateLoginMode = (mode: 'free' | 'demo' | 'locked') => {
    setLoginMode(mode);
    localStorage.setItem('biolog_login_mode', mode);
  };

  const selectedOrganism = ORGANISMS.find(o => o.id === selectedOrganismId) || ORGANISMS[0];

  // ── Special route detection ──────────────────────────────────────────────────
  const isAdminRoute = window.location.pathname.startsWith('/admin') || window.location.hostname.startsWith('admin.');
  const isJoinRoute = window.location.pathname.startsWith('/join');

  // ── Session restore on load ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.user_metadata?.role === 'school_admin' ? 'school_admin' : 'student';
        setCurrentUser(session.user);
        setUserRole(role);
        setCurrentScreen(role === 'school_admin' ? 'school-dashboard' : 'student-dashboard');
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.user_metadata?.role === 'school_admin' ? 'school_admin' : 'student';
        setCurrentUser(session.user);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        // Do not reset currentScreen here if it's already a public screen or not-found
        setCurrentScreen((prevScreen) => {
          if (prevScreen !== 'not-found' && prevScreen !== 'registration') {
            return 'auth';
          }
          return prevScreen;
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Check URL on mount for 404
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && !path.startsWith('/admin') && !path.startsWith('/join')) {
      setCurrentScreen('not-found');
    }
  }, []);

  // ── Navigation Wrapper ───────────────────────────────────────────────────────
  // Clears special URLs (like /join) when navigating to standard screens
  const navigateTo = (screen: ScreenType) => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    navigateTo('auth');
  };

  // Global search shortcut — press '/' to open search
  const [searchForceOpen, setSearchForceOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        setSearchForceOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelectOrganism = useCallback((id: string) => {
    setSelectedOrganismId(id);
  }, []);

  const handleStudentLogin = (user: any) => {
    setCurrentUser(user);
    setUserRole('student');
    navigateTo('student-dashboard');
  };

  const handleSchoolLogin = (user: any) => {
    setCurrentUser(user);
    setUserRole('school_admin');
    navigateTo('school-dashboard');
  };

  // ── Render: Super Admin portal ───────────────────────────────────────────────
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <SuperAdminPortal loginMode={loginMode} onUpdateLoginMode={updateLoginMode} />
      </div>
    );
  }

  // ── Render: Student join link ────────────────────────────────────────────────
  if (isJoinRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header currentScreen="auth" onNavigate={navigateTo} currentUser={null} userRole={null} />
        <JoinScreen
          onStudentLogin={handleStudentLogin}
          onNavigate={navigateTo}
        />
      </div>
    );
  }

  // ── Auth loading spinner ─────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Main app ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onSelectOrganism={handleSelectOrganism}
        currentUser={currentUser}
        userRole={userRole}
        searchForceOpen={searchForceOpen}
        onSearchClose={() => setSearchForceOpen(false)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Auth / Landing */}
        {currentScreen === 'auth' && (
          <AuthScreen
            onNavigate={navigateTo}
            onStudentLogin={handleStudentLogin}
            onSchoolLogin={handleSchoolLogin}
            loginMode={loginMode}
          />
        )}

        {/* Student Dashboard */}
        {currentScreen === 'student-dashboard' && currentUser && userRole === 'student' && (
          <StudentDashboard user={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />
        )}

        {/* School Admin Dashboard */}
        {currentScreen === 'school-dashboard' && currentUser && userRole === 'school_admin' && (
          <SchoolAdminDashboard user={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />
        )}

        {/* Encyclopedia — students only */}
        {currentScreen === 'encyclopedia' && currentUser && userRole === 'student' && (
          <>
            <Sidebar selectedId={selectedOrganismId} onSelect={setSelectedOrganismId} />
            <EncyclopediaScreen
              organism={selectedOrganism}
              onSelectOrganism={setSelectedOrganismId}
              onView3D={() => {
                setVisualizationSource('encyclopedia');
                navigateTo('visualization');
              }}
              onBack={() => navigateTo('student-dashboard')}
            />
          </>
        )}

        {/* Visualization Hub — students only */}
        {currentScreen === 'visualization-hub' && currentUser && userRole === 'student' && (
          <VisualizationHubScreen
            onSelectOrganism={setSelectedOrganismId}
            onNavigate={(screen) => {
              if (screen === 'visualization') setVisualizationSource('hub');
              navigateTo(screen);
            }}
          />
        )}

        {/* Visualization — students only */}
        {currentScreen === 'visualization' && currentUser && userRole === 'student' && (
          <VisualizationScreen
            user={currentUser}
            organism={selectedOrganism}
            source={visualizationSource}
            onBack={() => navigateTo(visualizationSource === 'hub' ? 'visualization-hub' : 'encyclopedia')}
          />
        )}

        {/* Past Questions — students only */}
        {currentScreen === 'past-questions' && currentUser && userRole === 'student' && (
          <PastQuestionsScreen onBack={() => navigateTo('student-dashboard')} onNavigate={navigateTo} />
        )}

        {/* School Registration — public */}
        {currentScreen === 'registration' && (
          <SchoolRegistrationScreen />
        )}

        {/* Internal admin tool */}
        {currentScreen === 'admin' && (
          <AdminScreen />
        )}

        {/* Teacher Webinar */}
        {currentScreen === 'teacher-webinar' && currentUser && userRole === 'school_admin' && (
        <TeacherWebinar user={currentUser} onBack={() => navigateTo('school-dashboard')} />

        )}

        {/* Student Webinar */}
        {currentScreen === 'student-webinar' && currentUser && userRole === 'student' && (
          <StudentWebinar user={currentUser} onBack={() => navigateTo('student-dashboard')} />
        )}

        {/* Teacher Quizzes */}
        {currentScreen === 'teacher-quizzes' && currentUser && userRole === 'school_admin' && (
          <TeacherQuizBuilder user={currentUser} onBack={() => navigateTo('school-dashboard')} />
        )}

        {/* Student Assignments */}
        {currentScreen === 'student-assignments' && currentUser && userRole === 'student' && (
          <StudentAssignmentsScreen user={currentUser} onBack={() => navigateTo('student-dashboard')} />
        )}

        {/* 404 Not Found */}
        {currentScreen === 'not-found' && (
          <NotFoundScreen onNavigate={navigateTo} />
        )}

        {/* Catch-all: redirect to auth if accessing protected screen while logged out */}
        {(currentScreen === 'encyclopedia' || currentScreen === 'visualization' || currentScreen === 'visualization-hub' || currentScreen === 'student-dashboard' || currentScreen === 'school-dashboard' || currentScreen === 'past-questions') && !currentUser && (
          <AuthScreen
            onNavigate={navigateTo}
            onStudentLogin={handleStudentLogin}
            onSchoolLogin={handleSchoolLogin}
            loginMode={loginMode}
          />
        )}
      </div>
    </div>
  );
}
