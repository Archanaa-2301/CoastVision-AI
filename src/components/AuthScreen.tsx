import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Mail, Lock, User as UserIcon, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: any, token: string) => void;
  onBack: () => void;
}

export default function AuthScreen({ onAuthSuccess, onBack }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'archaeologist' | 'researcher' | 'student'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Mock Forgot password
        setTimeout(() => {
          setResetSuccess(true);
          setLoading(false);
        }, 1200);
        return;
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password } 
        : { username, email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication process failed.');
      }

      // Success
      localStorage.setItem('cv_token', data.token);
      localStorage.setItem('cv_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);

    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (emailType: 'admin' | 'student') => {
    setEmail(emailType === 'admin' ? 'admin@coastalvision.edu' : 'student@coastalvision.edu');
    setPassword(emailType === 'admin' ? 'admin' : 'student');
    setIsLogin(true);
    setIsForgotPassword(false);
  };

  return (
    <div id="auth-screen" className="min-h-screen wave-bg flex flex-col justify-center items-center py-12 px-6 font-sans">
      <div className="absolute top-6 left-6">
        <button 
          onClick={onBack}
          className="text-xs font-semibold text-ocean hover:text-ocean-light flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
        >
          <span>&larr;</span> <span>Back to Main Web</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 glass"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-ocean text-white p-3 rounded-2xl shadow-md mb-3">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-ocean to-seagreen bg-clip-text text-transparent">
            CoastalVision AI
          </span>
          <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Research Console Sign-In</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3 text-rose-700 text-xs shadow-sm">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-700 text-xs font-medium">
            Reset guidelines have been sent to your academic email. Please check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input (Always needed) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono">Academic Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="researcher@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-sm transition-colors text-slate-800 font-sans"
              />
            </div>
          </div>

          {/* Username input (Only for Register) */}
          {!isLogin && !isForgotPassword && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono">Authorized Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Evelyn_Carter"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-sm transition-colors text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Password input (Only for Login & Register) */}
          {!isForgotPassword && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono">Password</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                    className="text-[10px] font-semibold text-ocean hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder={isLogin ? "••••••••" : "Create stable password"}
                  required={!isForgotPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-sm transition-colors text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Role selection (Only for Register) */}
          {!isLogin && !isForgotPassword && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono">Academic Discipline</label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-sm text-slate-700"
              >
                <option value="student">Student Investigator</option>
                <option value="researcher">Marine Geomorphologist</option>
                <option value="archaeologist">Coastal Archaeologist</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ocean hover:bg-ocean-light text-white rounded-2xl font-semibold shadow-md transition-all hover:translate-y-[-1px] disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isForgotPassword ? (
              'Reset Password'
            ) : isLogin ? (
              'Sign In to Console'
            ) : (
              'Register & Initialize'
            )}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        {/* Form Toggles */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isForgotPassword ? (
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setResetSuccess(false); }}
              className="text-ocean font-semibold hover:underline"
            >
              Back to Sign In
            </button>
          ) : isLogin ? (
            <p>
              Need a research workspace?{' '}
              <button 
                type="button" 
                onClick={() => { setIsLogin(false); setError(''); }}
                className="text-ocean font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have credentials?{' '}
              <button 
                type="button" 
                onClick={() => { setIsLogin(true); setError(''); }}
                className="text-ocean font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Logins block */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col space-y-2.5">
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-center flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-300" /> Bypasses / Demo Accounts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs text-slate-600 font-medium border border-slate-100 cursor-pointer"
            >
              Sign in as Admin
            </button>
            <button
              onClick={() => handleQuickLogin('student')}
              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs text-slate-600 font-medium border border-slate-100 cursor-pointer"
            >
              Sign in as Student
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
