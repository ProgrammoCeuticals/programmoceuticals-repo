import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-brand-border p-8 shadow-sm">
        <Link href="/" className="block mb-6">
          <span className="text-brand-blue font-bold text-lg">PharmIntern NG</span>
        </Link>

        <h1 className="text-2xl font-bold text-brand-gray-dark mb-1">Create your account</h1>
        <p className="text-sm text-brand-gray-mid mb-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue hover:underline">
            Log in
          </Link>
        </p>

        <div className="rounded-md bg-brand-blue-light border border-brand-blue/20 p-4 text-sm text-brand-blue">
          Registration form coming soon. API endpoint is live at{' '}
          <code className="font-mono text-xs">/api/v1/auth/register</code>
        </div>

        <p className="mt-6 text-xs text-brand-gray-mid text-center">
          Are you an internship centre?{' '}
          <Link href="/employers/register" className="text-brand-blue hover:underline">
            Register your organisation instead
          </Link>
        </p>
      </div>
    </main>
  );
}
