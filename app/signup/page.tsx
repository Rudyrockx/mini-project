'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      setSuccess('Signup successful! Check your email to verify.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      setError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl animate-float-delayed" />

      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/30">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-650 text-white shadow-md shadow-indigo-500/25 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A8.91 8.91 0 019 18a8.91 8.91 0 015 1.235M9.75 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Account
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-2 text-center">
            Sign up to access maps, profile details & subscription tiers
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200/30 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/20 border border-green-200/30 dark:border-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-2xl mb-6 text-sm animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-650 hover:from-indigo-600 hover:to-violet-750 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/90 dark:bg-zinc-950/90 px-3 text-zinc-500 dark:text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-2.5 rounded-xl transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,16.5,14.77,18,12,18a6,6,0,1,1,6-6c0,.37-.03.73-.08,1.09h2.75A9,9,0,1,0,12,21c3.1,0,5.75-2.06,7.1-5A8.75,8.75,0,0,0,21.35,11.1Z" fill="#EA4335" />
                <path d="M12,21c3.1,0,5.75-2.06,7.1-5l-2.22-1.78a5.27,5.27,0,0,1-4.88,3.78,6,6,0,1,1-6-6,6,6,0,0,1,6-6A5.73,5.73,0,0,1,16.2,8L18.1,6.1a9,9,0,1,0-6.1,14.9Z" fill="#FBBC05" />
                <path d="M12,3a5.73,5.73,0,0,1,4.2,1.9L18.1,3a9,9,0,0,0-15.2,6.1L5.12,10.87A5.94,5.94,0,0,1,12,3Z" fill="#4285F4" />
                <path d="M12,21c3.1,0,5.75-2.06,7.1-5l-2.22-1.78A5.27,5.27,0,0,1,12,18Z" fill="#34A853" />
              </g>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-2.5 rounded-xl transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-zinc-650 dark:text-zinc-400 mt-8">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-650 dark:text-indigo-400 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}