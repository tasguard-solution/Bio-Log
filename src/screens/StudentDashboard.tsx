import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { GraduationCap, LogOut, BookOpen, Microscope, AlertTriangle, Loader2 } from 'lucide-react';

interface StudentDashboardProps {
  user: any;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export function StudentDashboard({ user, onNavigate, onLogout }: StudentDashboardProps) {
  const [studentInfo, setStudentInfo] = useState<{ full_name: string; school_name: string } | null>(null);
  const [accessStatus, setAccessStatus] = useState<'loading' | 'active' | 'expired'>('loading');

  useEffect(() => {
    (async () => {
      try {
        // ── 1. Get school_id and full_name ─────────────────────────────────────
        // Prefer user_metadata (set at registration) — avoids needing a students table row
        let schoolId: string | null = user.user_metadata?.school_id ?? null;
        let fullName: string = user.user_metadata?.full_name ?? user.email ?? 'Student';

        // Fall back to students table if metadata is missing
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
          // No school linked at all
          setAccessStatus('expired');
          return;
        }

        // ── 2. Get school name ─────────────────────────────────────────────────
        const { data: school } = await supabase
          .from('schools')
          .select('name')
          .eq('id', schoolId)
          .maybeSingle();

        setStudentInfo({
          full_name: fullName,
          school_name: school?.name ?? 'Your School',
        });

        // ── 3. Check active subscription ───────────────────────────────────────
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('status, current_period_end')
          .eq('school_id', schoolId)
          .eq('status', 'active')
          .gte('current_period_end', new Date().toISOString())
          .maybeSingle();

        setAccessStatus(sub ? 'active' : 'expired');
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

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Welcome Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-on-primary-container" />
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-mono uppercase tracking-wider mb-0.5">{studentInfo?.school_name}</p>
              <h1 className="font-serif text-3xl font-bold text-primary">
                Welcome back, {studentInfo?.full_name?.split(' ')[0]}!
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-surface-container-high rounded-xl hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Active Access Banner */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
          <p className="text-sm text-green-700 font-medium">
            Your school's subscription is active — you have full access to all learning resources.
          </p>
        </div>

        {/* Resource Cards */}
        <h2 className="font-serif text-2xl font-bold text-on-surface mb-5">Learning Resources</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <button
            onClick={() => onNavigate('encyclopedia')}
            className="group flex flex-col items-start p-7 bg-surface rounded-2xl border border-surface-container-high hover:border-primary/40 hover:shadow-md transition-all duration-300 text-left hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface mb-1">Cell Encyclopedia</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Explore detailed entries for Animal Cell, Plant Cell, Bacteria, Fungi, Neurons, and more.
            </p>
            <span className="mt-4 text-sm font-semibold text-primary">Explore →</span>
          </button>

          <button
            onClick={() => onNavigate('visualization')}
            className="group flex flex-col items-start p-7 bg-surface rounded-2xl border border-surface-container-high hover:border-secondary/40 hover:shadow-md transition-all duration-300 text-left hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <Microscope className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface mb-1">3D Visualizations</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Interactive 3D models of cells and organelles. Rotate, zoom, and explore every structure.
            </p>
            <span className="mt-4 text-sm font-semibold text-secondary">Visualize →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
