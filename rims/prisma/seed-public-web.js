const { PrismaClient } = require('../node_modules/.prisma/client');
const prisma = new PrismaClient();

const WEBSITE_ID = '2aa5329d-32b2-4d8d-aa17-b51a4af32725';
const TENANT_ID  = '3f52a388-ce6b-4230-a7e4-6cfd7fa59bf5';
const USER_ID    = '03915e44-9bc6-4ab2-b096-a3488c64423d';

async function main() {
  // 1. Nav items
  const nav = await prisma.websiteNavigation.findFirst({ where: { websiteId: WEBSITE_ID, location: 'primary' } });
  if (nav) {
    const existing = await prisma.websiteNavigationItem.count({ where: { navigationId: nav.id } });
    if (existing === 0) {
      const items = [
        { label: 'Home',          linkType: 'external', externalUrl: '/',              sortOrder: 1 },
        { label: 'About',         linkType: 'external', externalUrl: '/about',         sortOrder: 2 },
        { label: 'Research',      linkType: 'external', externalUrl: '/research',      sortOrder: 3 },
        { label: 'Team',          linkType: 'external', externalUrl: '/team',          sortOrder: 4 },
        { label: 'Publications',  linkType: 'external', externalUrl: '/publications',  sortOrder: 5 },
        { label: 'News',          linkType: 'external', externalUrl: '/news',          sortOrder: 6 },
        { label: 'Events',        linkType: 'external', externalUrl: '/events',        sortOrder: 7 },
        { label: 'Partners',      linkType: 'external', externalUrl: '/partners',      sortOrder: 8 },
        { label: 'Opportunities', linkType: 'external', externalUrl: '/opportunities', sortOrder: 9 },
        { label: 'Contact',       linkType: 'external', externalUrl: '/contact',       sortOrder: 10 },
      ];
      for (const item of items) {
        await prisma.websiteNavigationItem.create({
          data: { navigationId: nav.id, tenantId: TENANT_ID, isVisible: true, ...item },
        });
      }
      console.log('✓ Nav items seeded');
    } else {
      console.log('Nav items already exist, skipping');
    }
  }

  // 2. News
  const newsCount = await prisma.websiteNews.count({ where: { websiteId: WEBSITE_ID } });
  if (newsCount === 0) {
    const newsItems = [
      {
        slug: 'new-amr-surveillance-findings',
        title: 'New Findings in AMR Surveillance Across West Africa',
        summary: 'Our latest surveillance data reveals shifting resistance patterns in key pathogens, with implications for treatment guidelines across the region.',
        body: 'Our antimicrobial resistance surveillance programme has completed its 2026 mid-year analysis, covering 14 sentinel sites across West Africa. The data reveals a significant increase in extended-spectrum beta-lactamase (ESBL)-producing Enterobacteriaceae, particularly in community settings. These findings have been shared with national health authorities and will inform updated treatment guidelines.',
        category: 'Research',
        publishedAt: new Date('2026-10-15'),
        status: 'PUBLISHED',
      },
      {
        slug: 'malaria-trial-phase-2-results',
        title: 'Phase II Trial Results Show Promise for Novel Malaria Combination Therapy',
        summary: 'Interim results from our Phase II clinical trial demonstrate improved efficacy and tolerability of the new artemisinin-based combination therapy.',
        body: 'The Phase II clinical trial of our novel artemisinin-based combination therapy has reached its primary endpoint. Interim analysis shows a 94% parasite clearance rate at day 3, compared to 87% for the current standard of care. Adverse events were mild and transient. The trial will now proceed to Phase III pending regulatory approval.',
        category: 'Clinical Trials',
        publishedAt: new Date('2026-10-01'),
        status: 'PUBLISHED',
      },
      {
        slug: 'wellcome-trust-fellowship-award',
        title: 'Dr. Chidi Okonkwo Awarded Wellcome Trust Research Fellowship',
        summary: 'We are proud to announce that Dr. Chidi Okonkwo has been awarded a prestigious Wellcome Trust Research Fellowship to advance his work in infectious disease modelling.',
        body: 'Dr. Chidi Okonkwo, Director of Epidemiology at our institute, has been awarded a five-year Wellcome Trust Research Fellowship valued at £1.2 million. The fellowship will support his work developing novel mathematical models for predicting infectious disease outbreaks in sub-Saharan Africa.',
        category: 'Awards',
        publishedAt: new Date('2026-09-20'),
        status: 'PUBLISHED',
      },
      {
        slug: 'long-covid-neurological-registry-launch',
        title: 'Institute Launches Long COVID Neurological Registry',
        summary: 'A new multi-site registry will track neurological outcomes in Long COVID patients across five countries, filling a critical evidence gap.',
        body: 'We have launched the Long COVID Neurological Registry, a prospective cohort study tracking neurological symptoms and outcomes in patients with post-acute sequelae of SARS-CoV-2 infection. The registry will enrol 2,000 participants across five countries over 24 months.',
        category: 'Research',
        publishedAt: new Date('2026-09-05'),
        status: 'PUBLISHED',
      },
      {
        slug: 'nih-genomics-grant',
        title: 'Institute Receives $2.5M NIH Grant for Genomic Surveillance Programme',
        summary: 'A major NIH grant will expand our whole-genome sequencing capacity and establish a regional genomic surveillance network.',
        body: 'The National Institutes of Health has awarded our institute a $2.5 million R01 grant to establish a regional genomic surveillance network for antimicrobial-resistant pathogens. The five-year grant will fund expansion of our whole-genome sequencing capacity and training of laboratory scientists at partner institutions.',
        category: 'Funding',
        publishedAt: new Date('2026-08-18'),
        status: 'PUBLISHED',
      },
    ];
    for (const n of newsItems) {
      await prisma.websiteNews.create({ data: { websiteId: WEBSITE_ID, tenantId: TENANT_ID, createdById: USER_ID, ...n } });
    }
    console.log('✓ News seeded');
  } else {
    console.log('News already exists, skipping');
  }

  // 3. Events
  const eventsCount = await prisma.websiteEvent.count({ where: { websiteId: WEBSITE_ID } });
  if (eventsCount === 0) {
    const events = [
      {
        slug: 'annual-research-symposium-2026',
        title: 'Annual Research Symposium 2026',
        summary: 'Our flagship annual symposium bringing together researchers, clinicians, and policymakers to share findings and shape the research agenda.',
        description: "Join us for two days of presentations, workshops, and networking. This year's theme is \"Bridging the Gap: From Bench to Policy.\"",
        startDatetime: new Date('2026-12-10T09:00:00Z'),
        endDatetime: new Date('2026-12-11T17:00:00Z'),
        venue: 'Institute Main Auditorium, Accra',
        isOnline: false,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-10-01'),
      },
      {
        slug: 'gcp-refresher-training',
        title: 'GCP Refresher Training Workshop',
        summary: 'A one-day intensive Good Clinical Practice refresher workshop for all clinical research staff.',
        description: 'This mandatory GCP refresher workshop covers ICH E6(R2) guidelines, adverse event reporting, informed consent procedures, and data integrity requirements.',
        startDatetime: new Date('2026-11-28T08:30:00Z'),
        endDatetime: new Date('2026-11-28T17:00:00Z'),
        venue: 'Training Room B, Institute Campus',
        isOnline: false,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-10-15'),
      },
      {
        slug: 'amr-webinar-series-session-3',
        title: 'AMR Webinar Series: Genomic Approaches to Resistance Surveillance',
        summary: 'The third session in our AMR webinar series focuses on whole-genome sequencing applications in resistance surveillance.',
        description: 'Dr. Wei Chen will present on the application of machine learning to whole-genome sequencing data for predicting antimicrobial resistance phenotypes.',
        startDatetime: new Date('2026-12-03T14:00:00Z'),
        endDatetime: new Date('2026-12-03T15:30:00Z'),
        venue: null,
        isOnline: true,
        registrationUrl: 'https://zoom.us/webinar/register',
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-01'),
      },
      {
        slug: 'community-health-forum-2027',
        title: 'Community Health Forum 2027',
        summary: 'An open forum engaging local communities in discussions about our research priorities and public health initiatives.',
        description: 'We invite community members, local health workers, and civil society organisations to join our annual Community Health Forum.',
        startDatetime: new Date('2027-01-22T10:00:00Z'),
        endDatetime: new Date('2027-01-22T16:00:00Z'),
        venue: 'Community Centre, Tema',
        isOnline: false,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-01'),
      },
    ];
    for (const e of events) {
      await prisma.websiteEvent.create({ data: { websiteId: WEBSITE_ID, tenantId: TENANT_ID, createdById: USER_ID, ...e } });
    }
    console.log('✓ Events seeded');
  } else {
    console.log('Events already exist, skipping');
  }

  // 4. Opportunities
  const oppsCount = await prisma.websiteOpportunity.count({ where: { websiteId: WEBSITE_ID } });
  if (oppsCount === 0) {
    const opps = [
      {
        slug: 'postdoc-amr-genomics',
        title: 'Postdoctoral Research Fellow — AMR Genomics',
        summary: 'We are seeking a talented postdoctoral researcher to join our AMR genomics team, working on whole-genome sequencing and bioinformatics analysis of resistant pathogens.',
        opportunityType: 'POSTDOC',
        department: 'Bioinformatics',
        location: 'Accra, Ghana',
        isRemote: false,
        closingDate: new Date('2026-12-31'),
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-01'),
      },
      {
        slug: 'phd-studentship-malaria-immunology',
        title: 'PhD Studentship — Malaria Immunology',
        summary: 'A fully funded PhD studentship is available to investigate immune evasion mechanisms in Plasmodium falciparum, in collaboration with the University of Ghana.',
        opportunityType: 'PHD',
        department: 'Drug Discovery',
        location: 'Accra, Ghana',
        isRemote: false,
        closingDate: new Date('2027-01-15'),
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-01'),
      },
      {
        slug: 'clinical-trials-coordinator',
        title: 'Clinical Trials Coordinator',
        summary: 'An experienced clinical trials coordinator is needed to support the day-to-day management of our Phase II and III clinical trials portfolio.',
        opportunityType: 'JOB',
        department: 'Clinical Research',
        location: 'Accra, Ghana',
        isRemote: false,
        closingDate: new Date('2026-12-15'),
        status: 'PUBLISHED',
        publishedAt: new Date('2026-10-20'),
      },
      {
        slug: 'data-science-internship-2027',
        title: 'Data Science Internship — Summer 2027',
        summary: 'A 12-week paid internship for final-year students or recent graduates in data science, bioinformatics, or a related field.',
        opportunityType: 'INTERNSHIP',
        department: 'Bioinformatics',
        location: 'Accra, Ghana',
        isRemote: true,
        closingDate: new Date('2027-02-28'),
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-01'),
      },
    ];
    for (const o of opps) {
      await prisma.websiteOpportunity.create({ data: { websiteId: WEBSITE_ID, tenantId: TENANT_ID, createdById: USER_ID, ...o } });
    }
    console.log('✓ Opportunities seeded');
  } else {
    console.log('Opportunities already exist, skipping');
  }

  await prisma.$disconnect();
  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
