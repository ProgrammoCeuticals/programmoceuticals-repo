import type { ServiceCategory } from '@/types'

export const services: ServiceCategory[] = [
  {
    id: 'laboratory',
    slug: 'laboratory',
    name: 'Laboratory Diagnostics',
    shortName: 'Laboratory',
    tagline: 'Precision at the molecular level',
    shortDescription:
      'Comprehensive blood tests, urine analysis and specialized laboratory testing delivered with accuracy and speed.',
    fullDescription:
      'Labville\'s laboratory diagnostics combine advanced analytical technology with expert clinical knowledge. From routine blood panels to complex specialized tests, every sample is processed with rigorous quality controls to deliver results you can rely on.',
    visual3DScene: 'MolecularScene',
    cta: { label: 'Explore Laboratory Diagnostics', href: '/services/laboratory' },
    subServices: [
      {
        name: 'Blood Tests',
        description: 'Full blood count, metabolic panels, lipid profiles and more.',
        verified: true,
      },
      {
        name: 'Urine Analysis',
        description: 'Urinalysis and urine culture for kidney and urinary tract assessment.',
        verified: true,
      },
      {
        name: 'Specialized Laboratory Tests',
        description: 'Advanced tests for specific clinical indications.',
        verified: true,
      },
    ],
  },
  {
    id: 'imaging',
    slug: 'imaging',
    name: 'Medical Imaging',
    shortName: 'Imaging',
    tagline: 'See inside with clinical clarity',
    shortDescription:
      'State-of-the-art X-rays, ultrasounds and CT scans delivered with precision in a patient-centered environment.',
    fullDescription:
      'Our medical imaging services use modern equipment and experienced technicians to produce accurate diagnostic images. Whether for routine assessment or complex clinical needs, Labville\'s imaging delivers the clarity that informed medical decisions require.',
    visual3DScene: 'ImagingScene',
    cta: { label: 'Explore Imaging', href: '/services/imaging' },
    subServices: [
      {
        name: 'X-Ray',
        description: 'Digital radiography for bone and chest assessment.',
        verified: true,
      },
      {
        name: 'Ultrasound',
        description: 'Real-time imaging for abdominal, pelvic and obstetric assessment.',
        verified: true,
      },
      {
        name: 'CT Scan',
        description: 'Cross-sectional imaging for detailed anatomical evaluation.',
        verified: true,
      },
    ],
  },
  {
    id: 'screening',
    slug: 'screening',
    name: 'Health Screening',
    shortName: 'Screening',
    tagline: 'Proactive health, informed decisions',
    shortDescription:
      'Tailored health screening packages for early detection, monitoring and proactive health management across all ages.',
    fullDescription:
      'Proactive health screening is one of the most powerful tools for long-term wellbeing. Labville\'s screening packages are designed to assess your health status comprehensively, detect risk early, and give you the information needed to make informed health decisions.',
    visual3DScene: 'HealthProfileScene',
    cta: { label: 'Explore Screening', href: '/services/screening' },
    subServices: [
      {
        name: 'Health Assessment',
        description: 'Comprehensive baseline health evaluation.',
        verified: true,
      },
      {
        name: 'Early Detection Screening',
        description: 'Tests focused on identifying risk factors before symptoms appear.',
        verified: true,
      },
      {
        name: 'Health Maintenance Screening',
        description: 'Ongoing monitoring for known health conditions or risk profiles.',
        verified: true,
      },
    ],
  },
  {
    id: 'specialized',
    slug: 'specialized',
    name: 'Specialized Diagnostics',
    shortName: 'Specialized',
    tagline: 'Advanced testing for complex questions',
    shortDescription:
      'Cardiovascular, hormonal and genetic testing for patients with specific clinical needs or referral requirements.',
    fullDescription:
      'When standard diagnostics are not enough, Labville\'s specialized testing services deliver the depth of analysis that complex clinical scenarios demand. Our specialized portfolio addresses cardiovascular risk, hormonal health, genetic screening and more.',
    visual3DScene: 'BiomarkerScene',
    cta: { label: 'Explore Specialized Diagnostics', href: '/services/specialized' },
    subServices: [
      {
        name: 'Cardiovascular Testing',
        description: 'Lipid panels, cardiac markers and cardiovascular risk profiling.',
        verified: true,
      },
      {
        name: 'Hormone Analysis',
        description: 'Thyroid, reproductive and adrenal hormone panels.',
        verified: true,
      },
      {
        name: 'Genetic Testing',
        description: 'Genetic screening and carrier testing panels.',
        verified: true,
      },
    ],
  },
  {
    id: 'corporate',
    slug: 'corporate',
    name: 'Corporate Health',
    shortName: 'Corporate',
    tagline: 'Better employee health starts with better information',
    shortDescription:
      'Customized health assessments, preventive screening and wellness consultations designed for organizations and their teams.',
    fullDescription:
      'Labville partners with organizations to deliver structured employee health programs. From pre-employment assessments to annual wellness screening, our corporate health services give employers the data they need to support a healthier, more productive workforce.',
    visual3DScene: 'NetworkScene',
    cta: { label: 'Talk to Labville', href: '/contact?subject=corporate' },
    subServices: [
      {
        name: 'Employee Health Assessments',
        description: 'Pre-employment and periodic health evaluations.',
        verified: true,
      },
      {
        name: 'Preventive Screening Programs',
        description: 'Group screening packages tailored to workforce demographics.',
        verified: true,
      },
      {
        name: 'Wellness Consultations',
        description: 'Guidance and recommendations based on group health data.',
        verified: true,
      },
    ],
  },
  {
    id: 'home-collection',
    slug: 'home-collection',
    name: 'Home Collection',
    shortName: 'Home Collection',
    tagline: 'The laboratory comes to you',
    shortDescription:
      'Trained Labville professionals visit your location to collect samples — bringing diagnostic accuracy and convenience together.',
    fullDescription:
      'For patients who cannot travel to a diagnostic centre, or who simply prefer the convenience of home-based care, Labville\'s home collection service brings our expertise directly to you. Trained personnel handle sample collection with the same standards as our centre.',
    visual3DScene: 'HomeCollectionScene',
    cta: { label: 'Request Home Collection', href: '/contact?subject=home-collection' },
    subServices: [
      {
        name: 'Home Sample Collection',
        description: 'A trained professional visits your home or office to collect samples.',
        verified: true,
      },
      {
        name: 'Service Coverage Area',
        description: '[PLACEHOLDER — Labville to confirm coverage zones in Lagos]',
        verified: false,
      },
    ],
  },
]

export const getServiceById = (id: string) =>
  services.find((s) => s.id === id) ?? null
