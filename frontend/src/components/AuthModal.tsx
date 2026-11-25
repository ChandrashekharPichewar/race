import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { AuthModalMode, User } from '../types/ride';
import {
  loginUser,
  registerDeviceId,
  saveUserSession,
  signupUser,
  storeAuthTokens,
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+1', flag: '🇺🇸', label: 'USA (+1)' },
  { code: '+44', flag: '🇬🇧', label: 'UK (+44)' },
  { code: '+971', flag: '🇦🇪', label: 'UAE (+971)' },
  { code: '+65', flag: '🇸🇬', label: 'Singapore (+65)' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
  onAuthSuccess,
}) => {
  // Sign In fields
  const [username, setUsername] = useState('');

  // Sign Up fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shared fields
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  const handleModeSwitch = (nextMode: AuthModalMode) => {
    setError('');
    onModeChange(nextMode);
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
    setPhone(digitsOnly);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      if (!username.trim()) {
        setError('Please enter your username or email.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
      if (phone.length < 8) {
        setError('Please enter a valid phone number.');
        return;
      }
    } else {
      if (!firstname.trim() || !lastname.trim()) {
        setError('Please enter your first name and last name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (phone.length < 8) {
        setError('Please enter a valid phone number.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    const deviceId = `${countryCode}${phone}`;
    setIsSubmitting(true);

    try {
      // 1. First register deviceId (phone number) and proceed only if it returns 200
      await registerDeviceId(deviceId);

      // 2. Call /api/auth/login or /api/auth/signup
      const authData =
        mode === 'signin'
          ? await loginUser({
              username: username.trim(),
              password,
              deviceId,
            })
          : await signupUser({
              firstname: firstname.trim(),
              lastname: lastname.trim(),
              email: email.trim(),
              password,
              deviceId,
            });

      // 3. Store tokens in cookies
      storeAuthTokens(authData.accessToken, authData.refreshToken);

      // 4. Store remaining user data (including userId) in sessionStorage
      const fullName = `${authData.firstname} ${authData.lastname}`.trim();
      const authenticatedUser: User = {
        id: authData.userId,
        userId: authData.userId,
        firstname: authData.firstname,
        lastname: authData.lastname,
        name: fullName || (mode === 'signin' ? username.trim() : firstname.trim()),
        email: mode === 'signin' ? username.trim() : email.trim(),
        phone: `${countryCode} ${phone}`,
        deviceId,
        role: 'both',
      };

      saveUserSession(authenticatedUser);
      onAuthSuccess(authenticatedUser);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Center Icon Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-emerald-50 shadow-sm">
              {mode === 'signin' ? (
                <UserCheck className="h-6 w-6 text-blue-600" />
              ) : (
                <UserPlus className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {mode === 'signin'
                ? 'Sign in with your account & phone number'
                : 'Fill in your details to join Race'}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {mode === 'signin' ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="john.doe@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstname}
                      onChange={(e) => {
                        setFirstname(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="John"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastname}
                      onChange={(e) => {
                        setLastname(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="john.doe@example.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                </div>
              </>
            )}

            {/* Country Code + Phone Number (used as deviceId) */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                <div className="relative flex items-center pr-2.5 border-r border-slate-200">
                  <select
                    aria-label="Country code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none bg-transparent pr-1 text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.flag}
                      </option>
                    ))}
                  </select>
                  <span className="sr-only">{selectedCountry.label}</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent pl-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                {mode === 'signin' ? 'Password' : 'Create Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Mode Switch */}
          <p className="mt-5 text-center text-sm text-slate-600">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleModeSwitch('signup')}
                  className="font-semibold text-blue-600 hover:underline disabled:opacity-50"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleModeSwitch('signin')}
                  className="font-semibold text-blue-600 hover:underline disabled:opacity-50"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
