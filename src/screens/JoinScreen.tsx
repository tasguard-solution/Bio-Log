import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { GraduationCap, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface JoinScreenProps {
  onStudentLogin: (user: any) => void;
  onNavigate: (screen: ScreenType) => void;
}

type JoinState = 'loading' | 'invalid' | 'no-subscription' | 'form' | 'success';

export function JoinScreen({ onStudentLogin, onNavigate }: JoinScreenProps) {
  const [joinState, setJoinState] = useState<JoinState>('loading');
  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Read ?school= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const schoolId = params.get('school');

    if (!schoolId) {
      setJoinState('invalid');
      return;
    }

    (async () => {
      // Look up the school
      const { data: schoolData } = await supabase
        .from('schools')
        .select('id, name')
        .eq('id', schoolId)
        .single();

      if (!schoolData) {
        setJoinState('invalid');
        return;
      }

      // Check active subscription — order by newest, take first (avoids maybeSingle error on duplicate rows)
      const { data: subRows } = await supabase
        .from('subscriptions')
        .select('id, status, current_period_end')
        .eq('school_id', schoolId)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      const subData = subRows?.[0] ?? null;

      if (!subData) {
        setSchool(schoolData);
        setJoinState('no-subscription');
        return;
      }

      setSchool(schoolData);
      setJoinState('form');
    })();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;
    setError('');
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, school_id: school.id, role: 'student' },
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Account creation failed.');

      // 2. Insert into students table
      const { error: studentError } = await supabase.from('students').insert([{
        id: authData.user.id,
        school_id: school.id,
        email,
        full_name: fullName,
      }]);
      // Ignore "already exists" errors — student row might already be there
      if (studentError && studentError.code !== '23505') throw studentError;

      setJoinState('success');

      // If Supabase email confirmation is disabled, auto-login
      if (authData.session) {
        setTimeout(() => onStudentLogin(authData.user), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. This email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (joinState === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // ─── Invalid Link ──────────────────────────────────────────────────────────
  if (joinState === 'invalid') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Invalid Join Link</h2>
          <p className="text-on-surface-variant mb-6">
            This link is invalid or has expired. Please ask your school administrator for a valid join link.
          </p>
          <button onClick={() => onNavigate('auth')} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-sm">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── No Active Subscription ────────────────────────────────────────────────
  if (joinState === 'no-subscription') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Subscription Inactive</h2>
          <p className="text-on-surface-variant mb-2">
            <strong>{school?.name}</strong> does not have an active Bio Log subscription.
          </p>
          <p className="text-on-surface-variant mb-6 text-sm">
            Please ask your school administrator to renew the subscription before joining.
          </p>
          <button onClick={() => onNavigate('auth')} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-sm">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ─── Success ───────────────────────────────────────────────────────────────
  if (joinState === 'success') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary mb-3">You're in!</h2>
          <p className="text-on-surface-variant">
            Welcome to <strong>{school?.name}</strong>'s Bio Log. You now have access to all learning resources.
          </p>
          <p className="text-sm text-on-surface-variant mt-3 opacity-70">Redirecting you now…</p>
        </div>
      </div>
    );
  }

  // ─── Registration Form ─────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-on-primary-container" />
          </div>
          <div>
            <p className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Joining as a student of</p>
            <h2 className="font-serif text-xl font-bold text-primary">{school?.name}</h2>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant mb-8 ml-15">
          Create your personal Bio Log account to access all learning resources.
        </p>

        {error && (
          <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Full Name</label>
            <input
              required
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Chukwuemeka Obi"
              className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Create Password</label>
            <div className="relative">
              <input
                required
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : 'Create Account & Join'}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Already have an account?{' '}
          <button onClick={() => onNavigate('auth')} className="text-primary font-medium">Sign in here</button>
        </p>
      </div>
    </div>
  );
}
