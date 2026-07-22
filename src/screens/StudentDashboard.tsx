import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { GraduationCap, LogOut, BookOpen, Microscope, AlertTriangle, Loader2, ClipboardList, TrendingUp } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { ORGANISMS } from '../data';

interface StudentDashboardProps {
  user: any;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--color-surface-container-high)" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="var(--color-secondary)" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="font-serif text-lg font-bold text-primary">{percent}%</span>
    </div>
  );
}

export function StudentDashboard({ user, onNavigate, onLogout }: StudentDashboardProps) {
  const [studentInfo, setStudentInfo] = useState<{ full_name: string; school_name: string } | null>(null);
  const [accessStatus, setAccessStatus] = useState<'loading' | 'active' | 'expired'>('loading');
  const { getProgressPercent, getQuizCount, visitedOrganisms } = useProgress();

  const totalOrganisms = ORGANISMS.length;
  const progressPercent = getProgressPercent(totalOrganisms);
  const quizzesCompleted = getQuizCount();
  const topicsLeft = totalOrganisms - visitedOrganisms.length;

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
      title: 'Cell Encyclopedia',
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
      onClick: () => onNavigate('visualization'),
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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
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
        <div className="mb-8 bg-surface rounded-2xl border border-outline-variant/30 p-5 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-on-surface mb-4">Your Progress</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing percent={progressPercent} />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-primary">{visitedOrganisms.length}</p>
                <p className="text-xs text-on-surface-variant">Topics visited</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-secondary">{topicsLeft}</p>
                <p className="text-xs text-on-surface-variant">Remaining</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-on-surface">{quizzesCompleted}</p>
                <p className="text-xs text-on-surface-variant">Quizzes done</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('encyclopedia')}
              className="shrink-0 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {visitedOrganisms.length === 0 ? 'Start Studying' : 'Continue →'}
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Access banner */}
        <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
          <p className="text-sm text-green-700 font-medium">
            Your school's subscription is active — full access to all resources.
          </p>
        </div>

        {/* Resource cards */}
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-4">Learning Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`group flex flex-col items-start p-5 sm:p-7 bg-surface rounded-2xl border border-surface-container-high hover:border-${card.color}/40 hover:shadow-md transition-all duration-300 text-left hover:-translate-y-1 active:scale-[0.98]`}
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
    </div>
  );
}
