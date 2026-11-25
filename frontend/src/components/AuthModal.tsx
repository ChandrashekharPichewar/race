import React, { useState } from 'react';
import { X, Eye, EyeOff, Navigation, Sparkles } from 'lucide-react';
import { AuthModalMode, User, UserRole } from '../types/ride';

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
  onAuthSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('both');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetError = () => setError('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !phone.trim() || password.length < 6) {
        setError('Please fill all fields and use a password of at least 6 characters.');
        return;
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
      };
      onAuthSuccess(newUser);
      onClose();
      return;
    }

    // Sign in validation
    if (!email.trim() || password.length < 4) {
      setError('Enter your email/phone and password (min 4 chars).');
      return;
    }

    const derivedName = email.includes('@')
      ? email.split('@')[0].replace(/[._]/g, ' ')
      : 'Race Traveler';

    const signedInUser: User = {
      id: `user-${Date.now()}`,
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 43210',
      role: 'both',
    };
    onAuthSuccess(signedInUser);
    onClose();
  };

  const handleDemoSignIn = () => {
    onAuthSuccess({
      id: 'user-demo',
      name: 'Chandu',
      email: 'chandu@raceapp.com',
      phone: '+91 98765 43210',
      role: 'both',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-race-500 text-white">
              <Navigation className="h-4 w-4 fill-current rotate-45" />
            </span>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900">
                {mode === 'signin' ? 'Welcome back to Race' : 'Create your Race account'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'signin'
                  ? 'Sign in to book or host rides instantly'
                  : 'Join thousands of daily commuters & hosts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                resetError();
                onModeChange('signin');
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                resetError();
                onModeChange('signup');
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 px-6 py-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chandu Pichewar"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-race-500 focus:ring-2 focus:ring-race-500/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              {mode === 'signin' ? 'Email or Mobile Number' : 'Email Address'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-race-500 focus:ring-2 focus:ring-race-500/20"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-race-500 focus:ring-2 focus:ring-race-500/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-race-500 focus:ring-2 focus:ring-race-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                I want to use Race as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['guest', 'host', 'both'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition ${
                      role === r
                        ? 'border-race-500 bg-race-50 text-race-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r === 'both' ? 'Guest & Host' : r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-race-500 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-race-600 transition"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          {mode === 'signin' && (
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-race-200 bg-race-50 py-2 text-xs font-semibold text-race-700 hover:bg-race-100 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Quick Demo Sign In (Chandu)</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
