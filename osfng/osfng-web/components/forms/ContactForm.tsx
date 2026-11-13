'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { ContactFormData } from '@/types'

const schema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Please enter a message of at least 10 characters'),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must agree to continue' }) }),
})

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border-light bg-bg-base text-text-primary placeholder:text-text-muted text-body-sm focus:outline-none focus:ring-2 focus:ring-green-mid/40 focus:border-green-mid transition-colors'
  const errorClass = 'mt-1 text-xs text-red-600'

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-mid/10 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-mid" aria-hidden="true" />
        </div>
        <h3 className="text-heading-md font-bold text-text-primary">Message sent</h3>
        <p className="text-body-sm text-text-secondary max-w-sm">
          Thank you for reaching out. The OSF team will be in touch with you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-green-mid hover:text-green-deep underline underline-offset-2 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="cf-name" className="block text-body-sm font-semibold text-text-primary mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input id="cf-name" type="text" placeholder="Your full name" className={inputClass} {...register('name')} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="cf-email" className="block text-body-sm font-semibold text-text-primary mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input id="cf-email" type="email" placeholder="your@email.com" className={inputClass} {...register('email')} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="cf-phone" className="block text-body-sm font-semibold text-text-primary mb-1.5">
          Phone Number <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <input id="cf-phone" type="tel" placeholder="+234..." className={inputClass} {...register('phone')} />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="cf-subject" className="block text-body-sm font-semibold text-text-primary mb-1.5">
          Subject <span className="text-red-500">*</span>
        </label>
        <input id="cf-subject" type="text" placeholder="How can we help?" className={inputClass} {...register('subject')} />
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="block text-body-sm font-semibold text-text-primary mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={5}
          placeholder="Tell us more..."
          className={`${inputClass} resize-none`}
          {...register('message')}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          id="cf-consent"
          type="checkbox"
          className="mt-0.5 w-4 h-4 accent-green-mid cursor-pointer"
          {...register('consent')}
        />
        <label htmlFor="cf-consent" className="text-body-sm text-text-secondary cursor-pointer">
          I agree to Operation Smile Foundation contacting me regarding my enquiry.
        </label>
      </div>
      {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

      {/* Error state */}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-600 shrink-0" aria-hidden="true" />
          <p className="text-body-sm text-red-700">Something went wrong. Please try again or contact us directly.</p>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={status === 'loading'}>
        {status === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...</>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}
