import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { ContactForm } from '@/components/ContactForm';

interface SiteInfo {
  branding?: {
    contactEmail?: string | null;
    contactPhone?: string | null;
    address?: string | null;
  } | null;
}

export default async function ContactPage() {
  const siteData = await apiFetch<SiteInfo>('');
  const branding = siteData?.branding;

  return (
    <>
      <PageHeader title="Contact Us" description="Get in touch with our team." />
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact info */}
        <section aria-label="Contact information">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Get in touch</h2>
          <address className="not-italic space-y-3 text-slate-600">
            {branding?.contactEmail && (
              <p>
                <span className="font-medium text-slate-700">Email: </span>
                <a
                  href={`mailto:${branding.contactEmail}`}
                  className="text-brand-600 hover:underline"
                >
                  {branding.contactEmail}
                </a>
              </p>
            )}
            {branding?.contactPhone && (
              <p>
                <span className="font-medium text-slate-700">Phone: </span>
                {branding.contactPhone}
              </p>
            )}
            {branding?.address && (
              <p>
                <span className="font-medium text-slate-700">Address: </span>
                {branding.address}
              </p>
            )}
          </address>
        </section>

        {/* Contact form */}
        <section aria-label="Send a message">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Send a message</h2>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
