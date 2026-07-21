import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { School, LogOut, Link2, Check, AlertTriangle, Loader2, CalendarClock, Users, CreditCard } from 'lucide-react';

interface SchoolAdminDashboardProps {
  user: any;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export function SchoolAdminDashboard({ user, onNavigate, onLogout }: SchoolAdminDashboardProps) {
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      // Look up school by admin's email
      const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!school) {
        setLoading(false);
        return;
      }

      setSchoolInfo(school);

      // Get subscription
      const { data: subRows } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })
        .limit(1);

      setSubscription(subRows?.[0] ?? null);

      // Get student count
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', school.id);

      setStudentCount(count ?? 0);
      setLoading(false);
    })();
  }, [user.email]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const copyJoinLink = () => {
    if (!schoolInfo) return;
    const link = `${window.location.origin}/join?school=${schoolInfo.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isActive = subscription?.status === 'active' &&
    new Date(subscription?.current_period_end) > new Date();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!schoolInfo) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">School Not Found</h2>
          <p className="text-on-surface-variant mb-6">
            We couldn't find a school linked to this account. Please contact support or register your school first.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('registration')} className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-medium text-sm">
              Register School
            </button>
            <button onClick={handleLogout} className="px-5 py-2.5 border border-outline-variant rounded-xl font-medium text-sm text-on-surface-variant">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-4xl mx-auto py-10 px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center">
              <School className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-0.5">School Admin Dashboard</p>
              <h1 className="font-serif text-3xl font-bold text-primary">{schoolInfo.name}</h1>
              <p className="text-sm text-on-surface-variant">{schoolInfo.email} · {schoolInfo.state}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-surface-container-high rounded-xl hover:bg-surface transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Subscription Status */}
        {isActive ? (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">Subscription Active</p>
              <p className="text-xs text-green-600">Expires {new Date(subscription.current_period_end).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className="font-mono text-sm font-bold text-green-700">₦{subscription.amount?.toLocaleString()}/mo</span>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm text-amber-700 font-medium">No Active Subscription</p>
                <p className="text-xs text-amber-600">Your students won't be able to access learning resources.</p>
              </div>
            </div>
            <button onClick={() => onNavigate('registration')}
              className="shrink-0 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
              Subscribe Now
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface p-5 rounded-2xl border border-surface-container-high text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-on-surface">{studentCount}</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Students Joined</div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-surface-container-high text-center">
            <CreditCard className="w-5 h-5 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-on-surface">₦{subscription?.amount?.toLocaleString() ?? '–'}</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Monthly Plan</div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-surface-container-high text-center">
            <CalendarClock className="w-5 h-5 text-outline mx-auto mb-2" />
            <div className="text-sm font-bold text-on-surface">
              {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
                : '–'}
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">Next Renewal</div>
          </div>
        </div>

        {/* Student Join Link */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-container-high">
          <h2 className="font-serif text-xl font-bold text-on-surface mb-1">Student Join Link</h2>
          <p className="text-sm text-on-surface-variant mb-5">
            Share this link with your students so they can self-register and access Bio Log.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-container-low border border-surface-container-highest rounded-xl py-3 px-4 font-mono text-xs text-on-surface-variant truncate">
              {window.location.origin}/join?school={schoolInfo.id}
            </div>
            <button
              onClick={copyJoinLink}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                copied ? 'bg-green-100 text-green-700' : 'bg-primary text-on-primary hover:opacity-90'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
