import type { Testimonial, TrustPillar, ProcessStep } from '@/types'

// ─────────────────────────────────────────
// BRAND
// Official name: Labville Diagnostic Centre
// Source: labvillediagnostic.com (reviewed 9 Oct 2026)
// ─────────────────────────────────────────
export const brand = {
  name:      'Labville Diagnostic Centre',
  shortName: 'Labville',

  // Real tagline from live site hero
  tagline: 'Precision in Every Test, Confidence in Every Result',

  // Hero headline — our editorial upgrade, grounded in real positioning
  heroHeadline: 'Where science becomes clinical insight.',

  // Real supporting copy from live site, lightly edited for clarity
  heroSubheadline:
    'At Labville Diagnostic Centre, we provide advanced diagnostic services to support your health. We focus on accuracy and making our services easy to access — ensuring you get reliable results for better health decisions.',

  // Real mission from About page
  mission:
    'At Labville, our mission is to deliver accessible, accurate and affordable diagnostic services. We strive to improve the health and wellbeing of our clients through innovation and expertise. Our compassionate care ensures early detection and effective monitoring. We aim to empower communities with quality healthcare solutions.',

  // Real supporting statement from live site
  healthPriority: 'Your Health is Our Priority.',
}

// ─────────────────────────────────────────
// CORE VALUES
// Source: About page — 6 values as published
// ─────────────────────────────────────────
export const coreValues = [
  {
    title: 'Accuracy',
    description:
      'Committed to precise and reliable diagnostic results you can depend on for every health decision.',
  },
  {
    title: 'Accessibility',
    description:
      'Diagnostic services designed to be affordable and available to everyone who needs them.',
  },
  {
    title: 'Innovation',
    description:
      'Embracing cutting-edge technology and techniques to improve diagnostic accuracy and efficiency.',
  },
  {
    title: 'Compassionate Care',
    description:
      'Prioritising client health and comfort through empathetic, personalised service at every step.',
  },
  {
    title: 'Excellence',
    description:
      'Striving for the highest standards in healthcare delivery — in every test, every result.',
  },
  {
    title: 'Integrity & Transparency',
    description:
      'Operating honestly and transparently in everything we do, building trust through consistent action.',
  },
]

// ─────────────────────────────────────────
// BENEFITS
// Source: "Experience Exceptional Benefits" section — live site
// Exactly 3 as published: Accurate Results, Affordable Services, Compassionate Care
// ─────────────────────────────────────────
export const trustPillars: TrustPillar[] = [
  {
    title: 'Accurate Results',
    description:
      'We use advanced technology to provide accurate and reliable results in a timely manner, supporting better treatment decisions.',
    icon: 'target',
  },
  {
    title: 'Affordable Services',
    description:
      'We are committed to making quality diagnostic testing accessible and affordable, supporting healthcare equity for all.',
    icon: 'users',
  },
  {
    title: 'Compassionate Care',
    description:
      'Our team provides compassionate support so every client feels informed, valued and at ease throughout their journey.',
    icon: 'heart',
  },
]

// ─────────────────────────────────────────
// PROCESS — SAMPLE TO RESULT
// Our editorial addition — general diagnostic workflow
// Confirm exact internal procedures with Labville before launch
// ─────────────────────────────────────────
export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Collection',
    description:
      'Sample collection at our centre or at your location via our home collection service.',
  },
  {
    number: '02',
    title: 'Identification',
    description:
      'Every sample is labelled, tracked and assigned a unique identification reference.',
  },
  {
    number: '03',
    title: 'Processing',
    description:
      'Samples are prepared according to the specific requirements of each test type.',
  },
  {
    number: '04',
    title: 'Analysis',
    description:
      'Advanced analytical instruments and expert technicians perform the requested tests.',
  },
  {
    number: '05',
    title: 'Quality Control',
    description:
      'Results undergo internal quality review before any report is issued.',
  },
  {
    number: '06',
    title: 'Result',
    description:
      'Your diagnostic report is prepared with clear, clinically relevant findings.',
  },
  {
    number: '07',
    title: 'Clinical Insight',
    description:
      'Results inform the next step — whether that is treatment, follow-up or reassurance.',
  },
]

// ─────────────────────────────────────────
// PATIENT JOURNEY
// Honest language — no implied instant online booking
// Real site CTA is "Contact Us" / "Get Tested Today"
// ─────────────────────────────────────────
export const patientJourney = [
  {
    step: 'Get in Touch',
    description:
      'Contact us by phone, email or our enquiry form to arrange your test.',
    icon: 'phone',
  },
  {
    step: 'Prepare',
    description:
      'Receive clear preparation instructions for your specific test.',
    icon: 'clipboard',
  },
  {
    step: 'Visit or Home Collection',
    description:
      'Attend our centre in Ikorodu or have a trained professional come to you.',
    icon: 'map-pin',
  },
  {
    step: 'Sample Collection',
    description:
      'Your sample is collected with precision, care and full identification tracking.',
    icon: 'flask',
  },
  {
    step: 'Receive Results',
    description:
      'Get your diagnostic report in the agreed format and timeframe.',
    icon: 'file-text',
  },
  {
    step: 'Take the Next Step',
    description:
      'Use your results to inform your next healthcare decision with confidence.',
    icon: 'arrow-right-circle',
  },
]

// ─────────────────────────────────────────
// TESTIMONIALS
// Source: Live site "Client Experiences" section
// IMPORTANT: Names and quotes are as published on labvillediagnostic.com
// Consent and identity verification required before launch — do not
// treat these as confirmed real clients until Labville confirms.
// ─────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    text: 'Labville Diagnostics made my testing process so simple and stress-free. Their staff was attentive and professional. Highly recommend!',
    theme: 'Stress-free experience',
    // name: 'Linda Brown' — pending consent verification
  },
  {
    text: 'I had a great experience at Labville. The team provided clear explanations throughout my tests, which helped me feel more comfortable.',
    theme: 'Clear communication',
    // name: 'Sarah Johnson' — pending consent verification
  },
  {
    text: "Thanks to Labville's rapid testing, I received my results quickly. Their service transformed my health management process.",
    theme: 'Fast results',
    // name: 'Michael Smith' — pending consent verification
  },
  {
    text: "Labville's commitment to patient care is outstanding. I'm grateful for the detailed information provided during my visit.",
    theme: 'Patient-centred care',
    // name: 'Emily Davis' — pending consent verification
  },
]

// ─────────────────────────────────────────
// DIAGNOSTIC ECOSYSTEM NODES
// ─────────────────────────────────────────
export const ecosystemNodes = [
  { id: 'patient',    label: 'Patient',         sublabel: 'Your health journey begins' },
  { id: 'collection', label: 'Collection',       sublabel: 'Centre or home visit' },
  { id: 'laboratory', label: 'Laboratory',       sublabel: 'Analysis & imaging' },
  { id: 'analysis',   label: 'Analysis',         sublabel: 'Expert interpretation' },
  { id: 'result',     label: 'Result',           sublabel: 'Your diagnostic report' },
  { id: 'insight',    label: 'Clinical Insight', sublabel: 'Informed next steps' },
]

// ─────────────────────────────────────────
// HEALTH CONCERNS
// Source: Homepage "Health Concerns Addressed" section — live site
// ─────────────────────────────────────────
export const healthConcerns = [
  {
    title: 'Delayed Diagnosis',
    description:
      'People may postpone seeking help because they are unsure about symptoms. Early diagnosis is essential for effective treatment and better outcomes — Labville helps you get the answers you need.',
  },
  {
    title: 'Accessible Testing',
    description:
      'Reliable diagnostic tests can be difficult to access, particularly where people face financial limitations. Labville is committed to affordable services while maintaining high-quality standards.',
  },
  {
    title: 'Lack of Information',
    description:
      'Patients may feel uncertain or confused about procedures and results. We prioritise education and transparency so you can make informed health decisions.',
  },
  {
    title: 'Healthcare Equity',
    description:
      'Some communities face barriers to quality healthcare, leading to health disparities. Labville aims to help close these gaps through accessibility and affordability.',
  },
]

// ─────────────────────────────────────────
// CLIENT-CENTRIC APPROACH
// Source: About page — "Our Client-Centric Approach"
// ─────────────────────────────────────────
export const clientApproach = [
  {
    title: 'Personalised Services',
    description:
      'Our services are tailored to each client\'s unique needs, ensuring the right tests and the right support at every stage.',
  },
  {
    title: 'Advanced Technology',
    description:
      'We use the latest diagnostic technology to deliver accurate and timely results for every patient.',
  },
  {
    title: 'Community Empowerment',
    description:
      'We engage with our community to promote health awareness and improve access to quality diagnostic services.',
  },
]
