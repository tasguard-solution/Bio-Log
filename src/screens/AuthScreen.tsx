import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { School, GraduationCap, Eye, EyeOff, ArrowLeft, Loader2, Lock, Play } from 'lucide-react';
import { DnaHelix } from '../components/DnaHelix';

// ─── Demo credentials (shown in demo mode) ─────────────────────────────────
const DEMO_SCHOOL_EMAIL = 'tasker@tasguard.com';
const DEMO_SCHOOL_PASSWORD = 'Owunari10$';
const DEMO_STUDENT_EMAIL = 'anointingtasker2002@gmail.com';
const DEMO_STUDENT_PASSWORD = 'Owunari10$';

// ─── LoginForm lives OUTSIDE AuthScreen so it never remounts on parent re-renders ───
interface LoginFormProps {
  role: 'student' | 'school';
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onStudentLogin: (user: any) => void;
  onSchoolLogin: (user: any) => void;
}

function LoginForm({ role, onBack, onNavigate, onStudentLogin, onSchoolLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Trigger the bio-metric scan animation
    window.dispatchEvent(new CustomEvent('biometric-scan'));

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('Login failed.');

      const userRole = data.user.user_metadata?.role;

      // Wait for scan animation to complete before redirecting
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (role === 'school') {
        if (userRole !== 'school_admin') {
          await supabase.auth.signOut();
          throw new Error('This email is not registered as a school admin. Are you a student?');
        }
        onSchoolLogin(data.user);
      } else {
        if (userRole === 'school_admin') {
          await supabase.auth.signOut();
          throw new Error("This is a school admin account. Please use 'I'm a School' to log in.");
        }
        onStudentLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex items-center justify-center bg-surface-container-low p-6 overflow-hidden">
      <DnaHelix />
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === 'school' ? 'bg-secondary/15' : 'bg-primary-container'}`}>
            {role === 'school'
              ? <School className="w-6 h-6 text-secondary" />
              : <GraduationCap className="w-6 h-6 text-on-primary-container" />}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary">
              {role === 'school' ? 'School Admin Login' : 'Student Login'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {role === 'school' ? "Manage your school's subscription & join links" : "Access your school's biology resources"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'school' ? 'admin@school.edu.ng' : 'your@email.com'}
              className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        {role === 'school' && (
          <p className="text-center text-sm text-on-surface-variant mt-6">
            New school?{' '}
            <button onClick={() => onNavigate('registration')} className="text-primary font-medium hover:underline">
              Register & Subscribe
            </button>
          </p>
        )}
        {role === 'student' && (
          <p className="text-center text-sm text-on-surface-variant mt-6">
            No account yet?{' '}
            <span className="text-primary font-medium">Ask your school for a join link.</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── DemoLoginForm — pre-filled, read-only, one-click sign-in ──────────────
interface DemoLoginFormProps {
  onStudentLogin: (user: any) => void;
  onSchoolLogin: (user: any) => void;
}

function DemoLoginForm({ onStudentLogin, onSchoolLogin }: DemoLoginFormProps) {
  const [activeRole, setActiveRole] = useState<'school' | 'student' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async (role: 'school' | 'student') => {
    setError('');
    setLoading(true);

    // Trigger the bio-metric scan animation
    window.dispatchEvent(new CustomEvent('biometric-scan'));
    
    try {
      const email = role === 'school' ? DEMO_SCHOOL_EMAIL : DEMO_STUDENT_EMAIL;
      const password = role === 'school' ? DEMO_SCHOOL_PASSWORD : DEMO_STUDENT_PASSWORD;

      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('Login failed.');

      // Wait for scan animation to complete before redirecting
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (role === 'school') {
        onSchoolLogin(data.user);
      } else {
        onStudentLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Selected role: show pre-filled form ──────────────────────────────────
  if (activeRole) {
    const email = activeRole === 'school' ? DEMO_SCHOOL_EMAIL : DEMO_STUDENT_EMAIL;
    const password = activeRole === 'school' ? DEMO_SCHOOL_PASSWORD : DEMO_STUDENT_PASSWORD;

    return (
      <div className="relative flex-1 flex items-center justify-center bg-surface-container-low p-6 overflow-hidden">
        <DnaHelix />
        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => { setActiveRole(null); setError(''); }}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeRole === 'school' ? 'bg-secondary/15' : 'bg-primary-container'}`}>
              {activeRole === 'school'
                ? <School className="w-6 h-6 text-secondary" />
                : <GraduationCap className="w-6 h-6 text-on-primary-container" />}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                {activeRole === 'school' ? 'School Admin' : 'Student'} Demo
              </h2>
              <p className="text-sm text-on-surface-variant">
                Pre-filled account — tap Sign In to continue
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl py-3 px-4 text-sm text-on-surface-variant cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
              <input
                type="password"
                readOnly
                value={password}
                className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl py-3 px-4 text-sm text-on-surface-variant cursor-not-allowed"
              />
            </div>

            <button
              onClick={() => handleDemoLogin(activeRole)}
              disabled={loading}
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                <><Play className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Role picker: show both demo accounts as cards ────────────────────────
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6 overflow-hidden">
      <DnaHelix />
      <div className="relative z-10 text-center mb-14 max-w-xl">
        <img src={logoUrl} alt="Bio Log Logo" className="w-24 h-24 object-contain mx-auto mb-6 drop-shadow-md" />
        <h1 className="font-serif text-5xl font-bold text-primary mb-4 leading-tight">
          Bio Log Demo
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Choose an account to explore. Credentials are pre-filled.
        </p>
      </div>

      <div className="relative z-10 grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <button
          onClick={() => setActiveRole('school')}
          className="group flex flex-col items-start p-8 bg-surface/90 backdrop-blur-sm rounded-3xl border border-surface-container-high hover:border-secondary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
            <School className="w-7 h-7 text-secondary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">School Admin</h3>
          <p className="text-xs font-mono text-on-surface-variant mb-1">{DEMO_SCHOOL_EMAIL}</p>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Manage subscriptions, students, and school settings.
          </p>
          <span className="text-sm font-semibold text-secondary">Sign In →</span>
        </button>

        <button
          onClick={() => setActiveRole('student')}
          className="group flex flex-col items-start p-8 bg-surface/90 backdrop-blur-sm rounded-3xl border border-surface-container-high hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">Student</h3>
          <p className="text-xs font-mono text-on-surface-variant mb-1">{DEMO_STUDENT_EMAIL}</p>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Explore cells, 3D models, quizzes, and WAEC past questions.
          </p>
          <span className="text-sm font-semibold text-primary">Sign In →</span>
        </button>
      </div>
    </div>
  );
}

// ─── AuthScreen manages which view to show ──────────────────────────────────
interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStudentLogin: (user: any) => void;
  onSchoolLogin: (user: any) => void;
  loginMode: 'free' | 'demo' | 'locked';
}

type AuthMode = 'landing' | 'student-login' | 'school-login';

export function AuthScreen({ onNavigate, onStudentLogin, onSchoolLogin, loginMode }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('landing');

  // ─── Demo mode: pre-filled accounts ───────────────────────────────────────
  if (loginMode === 'demo') {
    return <DemoLoginForm onStudentLogin={onStudentLogin} onSchoolLogin={onSchoolLogin} />;
  }

  // ─── Locked mode: access paused ───────────────────────────────────────────
  if (loginMode === 'locked') {
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6 overflow-hidden">
        <DnaHelix />
        <div className="relative z-10 text-center max-w-xl">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-4 leading-tight">
            Access Paused
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-2">
            Login is temporarily disabled.
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Please check back later or contact your school administrator for updates.
          </p>
        </div>
      </div>
    );
  }

  // ─── Free mode: normal login ──────────────────────────────────────────────
  if (mode === 'student-login') {
    return (
      <LoginForm
        role="student"
        onBack={() => setMode('landing')}
        onNavigate={onNavigate}
        onStudentLogin={onStudentLogin}
        onSchoolLogin={onSchoolLogin}
      />
    );
  }

  if (mode === 'school-login') {
    return (
      <LoginForm
        role="school"
        onBack={() => setMode('landing')}
        onNavigate={onNavigate}
        onStudentLogin={onStudentLogin}
        onSchoolLogin={onSchoolLogin}
      />
    );
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6 overflow-hidden">
      <DnaHelix />
      <div className="relative z-10 text-center mb-14 max-w-xl">
        <h1 className="font-serif text-5xl font-bold text-primary mb-4 leading-tight">
          Welcome to Bio Log
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Interactive biology learning for Nigerian secondary schools.
          Explore cells, organisms and more — in rich detail.
        </p>
      </div>

      <div className="relative z-10 grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <button
          onClick={() => setMode('student-login')}
          className="group flex flex-col items-start p-8 bg-surface/90 backdrop-blur-sm rounded-3xl border border-surface-container-high hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">I'm a Student</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Sign in to access your school's biology learning resources and 3D cell visualizations.
          </p>
          <span className="text-sm font-semibold text-primary">Sign In →</span>
        </button>

        <button
          onClick={() => setMode('school-login')}
          className="group flex flex-col items-start p-8 bg-surface/90 backdrop-blur-sm rounded-3xl border border-surface-container-high hover:border-secondary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
            <School className="w-7 h-7 text-secondary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">I'm a School</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Log in to your school admin dashboard, or register a new school.
          </p>
          <span className="text-sm font-semibold text-secondary">Log In →</span>
        </button>
      </div>

      <p className="relative z-10 text-xs text-on-surface-variant mt-10 opacity-60">
        Student? Ask your school administrator for your personal join link.
      </p>
    </div>
  );
}
