import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Log in' };

/**
 * Login page — form implementation (client component with API call) to follow
 * in the next sprint once the auth API is wired end-to-end.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-brand-border p-8 shadow-sm">
        {/* Logo / wordmark */}
        <Link href="/" className="block mb-6">
          <span className="text-brand-blue font-bold text-lg">PharmIntern NG</span>
        </Link>

        <h1 className="text-2xl font-bold text-brand-gray-dark mb-1">Log in</h1>
        <p className="text-sm text-brand-gray-mid mb-6">
          New here?{' '}
          <Link href="/register" className="text-brand-blue hover:underline">
            Create a free account
          </Link>
        </p>

        {/* Placeholder — replaced by LoginForm client component in next sprint */}
        <div className="rounded-md bg-brand-blue-light border border-brand-blue/20 p-4 text-sm text-brand-blue">
          Login form coming soon. API endpoints are live at{' '}
          <code className="font-mono text-xs">/api/v1/auth/login</code>
        </div>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-xs text-brand-gray-mid hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  );
}
