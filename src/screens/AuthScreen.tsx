import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ScreenType } from '../types';
import { School, GraduationCap, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStudentLogin: (user: any) => void;
}

type AuthMode = 'landing' | 'student-login' | 'school-choice';

export function AuthScreen({ onNavigate, onStudentLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) {
        onStudentLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'student-login') {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-low p-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => { setMode('landing'); setError(''); }}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-on-primary-container" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">Student Login</h2>
              <p className="text-sm text-on-surface-variant">Access your school's biology resources</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleStudentLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@school.edu.ng"
                className="w-full bg-surface border border-surface-container-highest rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            Don't have an account?{' '}
            <span className="text-primary font-medium">Ask your school for a join link.</span>
          </p>
        </div>
      </div>
    );
  }

  // Landing screen — two clear paths
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low p-6">
      {/* Hero */}
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

      {/* Two paths */}
      <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {/* Student Card */}
        <button
          onClick={() => setMode('student-login')}
          className="group flex flex-col items-start p-8 bg-surface rounded-3xl border border-surface-container-high hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">I'm a Student</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Sign in to access your school's biology learning resources and 3D cell visualizations.
          </p>
          <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Sign In →
          </span>
        </button>

        {/* School Card */}
        <button
          onClick={() => onNavigate('registration')}
          className="group flex flex-col items-start p-8 bg-surface rounded-3xl border border-surface-container-high hover:border-secondary/40 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
            <School className="w-7 h-7 text-secondary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-on-surface mb-2">I'm a School</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            Register your school, subscribe, and give all your students access to the Bio Log platform.
          </p>
          <span className="text-sm font-semibold text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
            Register School →
          </span>
        </button>
      </div>

      <p className="text-xs text-on-surface-variant mt-10 opacity-60">
        Student? Ask your school administrator for your personal join link.
      </p>
    </div>
  );
}
