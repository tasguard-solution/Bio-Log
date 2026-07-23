import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { GraduationCap, LogOut, BookOpen, Microscope, AlertTriangle, Loader2, ClipboardList, TrendingUp } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { ORGANISMS } from '../data';
import { MascotOnboarding } from '../components/MascotOnboarding';

interface StudentDashboardProps {
  user: any;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

import { DnaProgressBar } from '../components/DnaProgressBar';

export function StudentDashboard({ user, onNavigate, onLogout }: StudentDashboardProps) {
  const [studentInfo, setStudentInfo] = useState<{ full_name: string; school_name: string } | null>(null);
  const [accessStatus, setAccessStatus] = useState<'loading' | 'active' | 'expired'>('loading');
  const [tourKey, setTourKey] = useState(0);
  const { getProgressPercent, getQuizCount, visitedOrganisms } = useProgress();

  const totalOrganisms = ORGANISMS.length;
  const progressPercent = getProgressPercent(totalOrganisms);
  const quizzesCompleted = getQuizCount();
  const topicsLeft = totalOrganisms - visitedOrganisms.length;

  const totalXP = (visitedOrganisms.length * 10) + (quizzesCompleted * 50);
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const xpPercent = totalXP % 100;

  useEffect(() => {
    (async () => {
      try {
        let schoolId: string | null = user.user_metadata?.school_id ?? null;
        let fullName: string = user.user_metadata?.full_name ?? user.email ?? 'Student';

        if (!schoolId) {
          const { data: studentRow } = await supabase
            .from('students')
            .select('full_name, school_id')
            .eq('id', user.id)
            .maybeSingle();

          if (studentRow) {
            schoolId = studentRow.school_id;
            fullName = studentRow.full_name ?? fullName;
          }
        }

        if (!schoolId) {
          setAccessStatus('expired');
          return;
        }

        const { data: school } = await supabase
          .from('schools')
          .select('name')
          .eq('id', schoolId)
          .maybeSingle();

        setStudentInfo({
          full_name: fullName,
          school_name: school?.name ?? 'Your School',
        });

        const { data: subRows } = await supabase
          .from('subscriptions')
          .select('status, current_period_end')
          .eq('school_id', schoolId)
          .eq('status', 'active')
          .gte('current_period_end', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        setAccessStatus(subRows?.[0] ? 'active' : 'expired');
      } catch (err) {
        console.error('StudentDashboard load error:', err);
        setAccessStatus('expired');
      }
    })();
  }, [user.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleRetakeTutorial = () => {
    localStorage.removeItem('hasSeenBioLogOnboarding');
    setTourKey(k => k + 1);
  };

  if (accessStatus === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (accessStatus === 'expired') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Subscription Expired</h2>
          <p className="text-on-surface-variant mb-6">
            Your school's Bio Log subscription is not currently active. Please contact your school administrator to renew access.
          </p>
          <button onClick={handleLogout} className="px-6 py-3 bg-surface border border-outline-variant rounded-xl font-medium text-sm flex items-center gap-2 mx-auto">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    {
      id: 'encyclopedia',
      icon: BookOpen,
      title: 'Encyclopedia',
      desc: 'Detailed entries for all SS1–SS3 biology topics with interactive diagrams.',
      cta: 'Explore →',
      color: 'primary',
      onClick: () => onNavigate('encyclopedia'),
    },
    {
      id: 'visualization',
      icon: Microscope,
      title: '3D Visualizations',
      desc: 'Interactive 3D models of cells and organelles. Rotate, zoom, and explore.',
      cta: 'Visualize →',
      color: 'secondary',
      onClick: () => onNavigate('visualization-hub'),
    },
    {
      id: 'past-questions',
      icon: ClipboardList,
      title: 'WAEC Past Questions',
      desc: '60+ WAEC Biology objective questions from 2008–2017 with explanations.',
      cta: 'Practice →',
      color: 'primary',
      onClick: () => onNavigate('past-questions'),
    },
    {
      id: 'progress',
      icon: TrendingUp,
      title: 'My Progress',
      desc: `${visitedOrganisms.length}/${totalOrganisms} topics visited · ${quizzesCompleted} quiz${quizzesCompleted !== 1 ? 'zes' : ''} completed`,
      cta: 'View Progress →',
      color: 'secondary',
      onClick: () => onNavigate('encyclopedia'),
    },
  ];

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6">

        {/* Welcome Header */}
        <div id="tour-welcome" className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-on-primary-container" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-mono uppercase tracking-wider mb-0.5">
                {studentInfo?.school_name}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-tight">
                Welcome back, {studentInfo?.full_name?.split(' ')[0]}!
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-surface-container-high rounded-xl hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Progress widget */}
        <div id="tour-progress" className="mb-8 bg-surface rounded-2xl border border-outline-variant/30 p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle DNA background watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 15c6.667-6 13.333 0 20-6" />
              <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
              <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
              <path d="M17 6l-6 6" />
              <path d="M13 18l-6-6" />
            </svg>
          </div>
          
          <h2 className="font-serif text-lg font-bold text-on-surface mb-2">Your Biological Journey</h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
                <div>
                  <p className="font-serif text-2xl font-bold text-primary">{totalXP}</p>
                  <p className="text-xs text-on-surface-variant">Total XP</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-secondary">{visitedOrganisms.length}</p>
                  <p className="text-xs text-on-surface-variant">Topics visited</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-on-surface">{quizzesCompleted}</p>
                  <p className="text-xs text-on-surface-variant">Quizzes done</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-outline">{topicsLeft}</p>
                  <p className="text-xs text-on-surface-variant">Topics Left</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRetakeTutorial}
                  className="shrink-0 px-5 py-2.5 bg-surface-container border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors w-full sm:w-auto"
                >
                  Tour Bio Log
                </button>
                <button
                  onClick={() => onNavigate('encyclopedia')}
                  className="shrink-0 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  {visitedOrganisms.length === 0 ? 'Start Studying' : 'Continue →'}
                </button>
              </div>
            </div>
            
            <DnaProgressBar percent={xpPercent} level={currentLevel} />
          </div>
        </div>



        {/* Resource cards */}
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-4">Learning Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(card => (
            <button
              key={card.id}
              id={card.id === 'progress' ? undefined : `tour-${card.id}`}
              onClick={card.onClick}
              className={`group flex flex-col items-start p-5 sm:p-7 bg-surface rounded-2xl border border-surface-container-high hover:border-${card.color}/40 hover:shadow-md transition-all duration-300 text-left hover:-translate-y-1 active:scale-[0.98] relative`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-${card.color}/10 flex items-center justify-center mb-4 group-hover:bg-${card.color}/20 transition-colors`}>
                <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${card.color}`} />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface mb-1">{card.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed flex-1">{card.desc}</p>
              <span className={`mt-4 text-sm font-semibold text-${card.color}`}>{card.cta}</span>
            </button>
          ))}
        </div>
      </div>
      <MascotOnboarding key={tourKey} />
    </div>
  );
}
