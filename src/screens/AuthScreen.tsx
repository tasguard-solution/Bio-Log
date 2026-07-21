import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { School, GraduationCap, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStudentLogin: (user: any) => void;
  onSchoolLogin: (user: any) => void;
}

type AuthMode = 'landing' | 'student-login' | 'school-login';

export function AuthScreen({ onNavigate, onStudentLogin, onSchoolLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = (nextMode: AuthMode) => {
    setEmail(''); setPassword(''); setError(''); setMode(nextMode);
  };

  const handleLogin = async (e: React.FormEvent, role: 'student' | 'school') => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('Login failed.');

      const userRole = data.user.user_metadata?.role;

      if (role === 'school') {
        if (userRole !== 'school_admin') {
          await supabase.auth.signOut();
          throw new Error('This email is not registered as a school admin. Are you a student?');
        }
        onSchoolLogin(data.user);
      } else {
        if (userRole === 'school_admin') {
          await supabase.auth.signOut();
          throw new Error('This is a school admin account. Please use "I\'m a School" to log in.');
        }
        onStudentLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = ({ role }: { role: 'student' | 'school' }) => (
    <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => resetForm('landing')}
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
              {role === 'school' ? 'Manage your school\'s subscription & join links' : 'Access your school\'s biology resources'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={e => handleLogin(e, role)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
            <input
              required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'school' ? 'admin@school.edu.ng' : 'your@email.com'}
              className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
            <div className="relative">
              <input
                required type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm">
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

  if (mode === 'student-login') return <LoginForm role="student" />;
  if (mode === 'school-login') return <LoginForm role="school" />;

  // ─── Landing ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6">
      <div className="text-center mb-14 max-w-xl">
        <div className="w-20 h-20 rounded-3xl bg-primary-container flex items-center justify-center mx-auto mb-6 shadow-sm">
          <div className="w-10 h-10 border-[3px] border-on-primary-container rounded-full grid grid-cols-2 grid-rows-2 gap-[3px] p-[3px]">
            <div className="bg-on-primary-container rounded-full" />
            <div className="bg-on-primary-container rounded-full" />
            <div className="bg-on-primary-container rounded-full" />
            <div className="bg-on-primary-container rounded-full" />
          </div>
        </div>
        <h1 className="font-serif text-5xl font-bold text-primary mb-4 leading-tight">
          Welcome to Bio Log
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Interactive biology learning for Nigerian secondary schools.
          Explore cells, organisms and more — in rich detail.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {/* Student Card */}
        <button onClick={() => resetForm('student-login')}
          className="group flex flex-col items-start p-8 bg-surface rounded-3xl border border-surface-container-high hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">I'm a Student</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Sign in to access your school's biology learning resources and 3D cell visualizations.
          </p>
          <span className="text-sm font-semibold text-primary">Sign In →</span>
        </button>

        {/* School Card */}
        <button onClick={() => resetForm('school-login')}
          className="group flex flex-col items-start p-8 bg-surface rounded-3xl border border-surface-container-high hover:border-secondary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1">
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

      <p className="text-xs text-on-surface-variant mt-10 opacity-60">
        Student? Ask your school administrator for your personal join link.
      </p>
    </div>
  );
}
