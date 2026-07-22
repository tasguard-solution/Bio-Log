import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import {
  School, LogOut, Link2, Check, AlertTriangle, Loader2,
  CalendarClock, Users, CreditCard, ChevronLeft, ChevronRight,
} from 'lucide-react';

interface SchoolAdminDashboardProps {
  user: any;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export function SchoolAdminDashboard({ user, onNavigate, onLogout }: SchoolAdminDashboardProps) {
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: school } = await supabase
        .from('schools')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!school) { setLoading(false); return; }
      setSchoolInfo(school);

      const { data: subRows } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })
        .limit(1);
      setSubscription(subRows?.[0] ?? null);

      // Student count
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', school.id);
      setStudentCount(count ?? 0);

      // Student roster (first page)
      const { data: roster } = await supabase
        .from('students')
        .select('id, full_name, email, created_at')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1);
      setStudents(roster ?? []);

      setLoading(false);
    })();
  }, [user.email]);

  const fetchPage = async (p: number) => {
    if (!schoolInfo) return;
    const { data } = await supabase
      .from('students')
      .select('id, full_name, email, created_at')
      .eq('school_id', schoolInfo.id)
      .order('created_at', { ascending: false })
      .range(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE - 1);
    setStudents(data ?? []);
    setPage(p);
  };

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
  const totalPages = Math.ceil(studentCount / PAGE_SIZE);

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
          <div className="flex gap-3 justify-center flex-wrap">
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
      <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center shrink-0">
              <School className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-0.5">School Admin</p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-tight">{schoolInfo.name}</h1>
              <p className="text-sm text-on-surface-variant">{schoolInfo.email} · {schoolInfo.state}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-surface-container-high rounded-xl hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Subscription Status */}
        {isActive ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">Subscription Active</p>
              <p className="text-xs text-green-600">Expires {new Date(subscription.current_period_end).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className="font-mono text-sm font-bold text-green-700">₦{subscription.amount?.toLocaleString()}/mo</span>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm text-amber-700 font-medium">No Active Subscription</p>
                <p className="text-xs text-amber-600">Students can't access resources without an active plan.</p>
              </div>
            </div>
            <button onClick={() => onNavigate('registration')} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
              Subscribe Now
            </button>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { icon: Users, label: 'Students', value: studentCount },
            { icon: CreditCard, label: 'Monthly Plan', value: subscription?.amount ? `₦${subscription.amount.toLocaleString()}` : '–' },
            { icon: CalendarClock, label: 'Renews', value: subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '–' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface rounded-2xl border border-surface-container-high p-4 sm:p-5 text-center">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-2" />
              <div className="font-serif text-lg sm:text-2xl font-bold text-on-surface">{value}</div>
              <div className="text-xs text-on-surface-variant mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Student Join Link */}
          <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-surface-container-high">
            <h2 className="font-serif text-xl font-bold text-on-surface mb-1">Student Join Link</h2>
            <p className="text-sm text-on-surface-variant mb-4">
              Share this link with your students so they can self-register.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-surface-container-low border border-surface-container-highest rounded-xl py-3 px-4 font-mono text-xs text-on-surface-variant truncate">
                {window.location.origin}/join?school={schoolInfo.id}
              </div>
              <button
                onClick={copyJoinLink}
                className={`shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-primary text-on-primary hover:opacity-90'}`}
              >
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* Student Roster */}
          <div className="bg-surface rounded-2xl border border-surface-container-high overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-on-surface">Student Roster</h2>
                <p className="text-xs text-on-surface-variant">{studentCount} student{studentCount !== 1 ? 's' : ''} registered</p>
              </div>
              <Users className="w-5 h-5 text-outline" />
            </div>

            {students.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant">
                <Users className="w-10 h-10 opacity-30 mx-auto mb-3" />
                <p className="text-sm">No students have joined yet.</p>
                <p className="text-xs mt-1 opacity-70">Share the join link above to get started.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/20">
                        <th className="text-left px-5 sm:px-6 py-3 font-mono text-xs text-outline uppercase tracking-wider">#</th>
                        <th className="text-left px-5 sm:px-6 py-3 font-mono text-xs text-outline uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 sm:px-6 py-3 font-mono text-xs text-outline uppercase tracking-wider hidden sm:table-cell">Email</th>
                        <th className="text-left px-5 sm:px-6 py-3 font-mono text-xs text-outline uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => (
                        <tr key={s.id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-5 sm:px-6 py-3.5 text-on-surface-variant font-mono text-xs">{page * PAGE_SIZE + i + 1}</td>
                          <td className="px-5 sm:px-6 py-3.5 font-medium text-on-surface">{s.full_name || '—'}</td>
                          <td className="px-5 sm:px-6 py-3.5 text-on-surface-variant hidden sm:table-cell">{s.email}</td>
                          <td className="px-5 sm:px-6 py-3.5 text-on-surface-variant text-xs">
                            {new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="px-5 sm:px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <p className="text-xs text-on-surface-variant">
                      Page {page + 1} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={page === 0}
                        onClick={() => fetchPage(page - 1)}
                        className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={page >= totalPages - 1}
                        onClick={() => fetchPage(page + 1)}
                        className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Billing History */}
          <div className="bg-surface rounded-2xl border border-surface-container-high overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-on-surface">Subscription & Billing</h2>
                <p className="text-xs text-on-surface-variant">Current plan details</p>
              </div>
              <CreditCard className="w-5 h-5 text-outline" />
            </div>
            <div className="p-5 sm:p-6">
              {subscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-container-low rounded-xl p-4">
                      <p className="text-xs text-on-surface-variant mb-1">Status</p>
                      <p className={`font-semibold text-sm ${isActive ? 'text-green-700' : 'text-amber-700'}`}>
                        {isActive ? '● Active' : '● Expired'}
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4">
                      <p className="text-xs text-on-surface-variant mb-1">Amount</p>
                      <p className="font-semibold text-sm text-on-surface">₦{subscription.amount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-4 col-span-2 sm:col-span-1">
                      <p className="text-xs text-on-surface-variant mb-1">Expires</p>
                      <p className="font-semibold text-sm text-on-surface">
                        {new Date(subscription.current_period_end).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {!isActive && (
                    <button
                      onClick={() => onNavigate('registration')}
                      className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Renew Subscription →
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-10 h-10 opacity-30 mx-auto mb-3 text-on-surface-variant" />
                  <p className="text-sm text-on-surface-variant mb-4">No subscription found for this school.</p>
                  <button onClick={() => onNavigate('registration')} className="px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90">
                    Subscribe Now →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
