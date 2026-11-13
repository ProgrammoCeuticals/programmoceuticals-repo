'use client';

import { useState } from 'react';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consentGiven: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="rounded-lg bg-green-50 border border-green-200 p-6 text-center"
      >
        <p className="text-green-800 font-medium">
          Thank you for your message. We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Contact form">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          autoComplete="off"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 resize-y"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="contact-consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
          checked={form.consentGiven}
          onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })}
        />
        <label htmlFor="contact-consent" className="text-sm text-slate-600">
          I consent to this website storing my submitted information so they can respond to
          my enquiry. <span aria-hidden="true">*</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
