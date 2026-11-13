/**
 * Seed script — SYNTHETIC DATA ONLY
 * Never seed with real applicant documents, credentials, or personal data.
 *
 * Run: pnpm prisma:seed
 */

import { PrismaClient, UserRole, OrgMemberRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with synthetic data...');

  // ── Reference data ────────────────────────────────────────────────────────

  const practiceAreas = [
    { name: 'Community Pharmacy', displayOrder: 1 },
    { name: 'Hospital Pharmacy', displayOrder: 2 },
    { name: 'Industrial Pharmacy', displayOrder: 3 },
    { name: 'Supply Chain / Distribution', displayOrder: 4 },
    { name: 'Regulatory Affairs', displayOrder: 5 },
    { name: 'Other Pharmacy-Related', displayOrder: 6 },
  ];

  for (const area of practiceAreas) {
    await prisma.practiceArea.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    });
  }
  console.log('✅ Practice areas seeded');

  const orgTypes = [
    'Community Pharmacy',
    'Hospital / Teaching Hospital',
    'Industrial / Manufacturing',
    'Supply Chain / Distribution',
    'Regulatory / Government Agency',
    'Research Institution',
    'Other',
  ];

  for (const name of orgTypes) {
    await prisma.organisationType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Organisation types seeded');

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
    'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  ];

  for (const name of states) {
    await prisma.state.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ States seeded');

  // ── Platform admin account ──────────────────────────────────────────────

  const adminEmail = process.env['SEED_ADMIN_EMAIL'] ?? 'admin@pharmintern.ng';
  const adminPassword = process.env['SEED_ADMIN_PASSWORD'];
  if (!adminPassword) {
    throw new Error('SEED_ADMIN_PASSWORD env variable is required for seeding');
  }

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      role: UserRole.PLATFORM_ADMIN,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Platform admin seeded: ${admin.email}`);

  // ── Synthetic applicant ────────────────────────────────────────────────

  const applicantHash = await bcrypt.hash('TestPass123!', 12);
  const applicant = await prisma.user.upsert({
    where: { email: 'test.applicant@example.ng' },
    update: {},
    create: {
      email: 'test.applicant@example.ng',
      passwordHash: applicantHash,
      role: UserRole.APPLICANT,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.applicantProfile.upsert({
    where: { userId: applicant.id },
    update: {},
    create: {
      userId: applicant.id,
      fullName: 'Test Applicant (Synthetic)',
      university: 'University of Example, Abuja',
      graduationYear: 2024,
    },
  });
  console.log(`✅ Synthetic applicant seeded: ${applicant.email}`);

  // ── Synthetic employer ─────────────────────────────────────────────────

  const employerHash = await bcrypt.hash('TestPass123!', 12);
  const employerUser = await prisma.user.upsert({
    where: { email: 'hr@example-pharmacy.ng' },
    update: {},
    create: {
      email: 'hr@example-pharmacy.ng',
      passwordHash: employerHash,
      role: UserRole.EMPLOYER_STAFF,
      emailVerifiedAt: new Date(),
    },
  });

  const communityType = await prisma.organisationType.findFirst({
    where: { name: 'Community Pharmacy' },
  });

  const org = await prisma.organisation.upsert({
    where: { id: 'seed-org-00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'seed-org-00000000-0000-0000-0000-000000000001',
      name: 'Example Pharmacy Ltd (Synthetic)',
      typeId: communityType?.id,
      verificationStatus: 'DRAFT',
      createdByUserId: employerUser.id,
    },
  });

  const membership = await prisma.organisationMembership.upsert({
    where: { organisationId_userId: { organisationId: org.id, userId: employerUser.id } },
    update: {},
    create: {
      organisationId: org.id,
      userId: employerUser.id,
      isOwner: true,
      acceptedAt: new Date(),
    },
  });

  await prisma.membershipRole.upsert({
    where: { membershipId_role: { membershipId: membership.id, role: OrgMemberRole.ORGANISATION_OWNER } },
    update: {},
    create: {
      membershipId: membership.id,
      role: OrgMemberRole.ORGANISATION_OWNER,
    },
  });
  console.log(`✅ Synthetic employer org seeded: ${org.name}`);

  console.log('\n🌱 Seed complete. All data is synthetic — do not use in production.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
