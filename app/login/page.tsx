'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl animate-float-delayed" />

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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-2 text-center">
            Log in to manage your premium locations & settings
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-205/30 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm">
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

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Logging in...' : 'Sign In'}
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
            onClick={() => handleSocialSignIn('google')}
            className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-2.5 rounded-xl transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,16.5,14.77,18,12,18a6,6,0,1,1,6-6c0,.37-.03.73-.08,1.09h2.75A9,9,0,1,0,12,21c3.1,0,5.75-2.06,7.1-5A8.75,8.75,0,0,0,21.35,11.1Z" fill="#EA4335" />
                <path d="M12,21c3.1,0,5.75-2.06,7.1-5l-2.22-1.78a5.27,5.27,0,0,1-4.88,3.78,6,6,0,0,1-6-6,6,6,0,0,1,6-6A5.73,5.73,0,0,1,16.2,8L18.1,6.1a9,9,0,1,0-6.1,14.9Z" fill="#FBBC05" />
                <path d="M12,3a5.73,5.73,0,0,1,4.2,1.9L18.1,3a9,9,0,0,0-15.2,6.1L5.12,10.87A5.94,5.94,0,0,1,12,3Z" fill="#4285F4" />
                <path d="M12,21c3.1,0,5.75-2.06,7.1-5l-2.22-1.78A5.27,5.27,0,0,1,12,18Z" fill="#34A853" />
              </g>
            </svg>
            Google
          </button>
          <button
            onClick={() => handleSocialSignIn('facebook')}
            className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-2.5 rounded-xl transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-8">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-indigo-650 dark:text-indigo-400 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}