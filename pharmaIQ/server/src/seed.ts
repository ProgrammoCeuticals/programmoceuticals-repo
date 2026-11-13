import { Client } from "../node_modules/@types/pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

// ── Helpers ───────────────────────────────────────────────────────────────────
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randBool = (prob = 0.5) => Math.random() < prob;
const pad = (n: number, len = 5) => String(n).padStart(len, "0");
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);
const dateStr = (d: Date) => d.toISOString().split("T")[0];

// ── Reference data ────────────────────────────────────────────────────────────
const firstNamesM = [
  "Chukwuemeka",
  "Oluwaseun",
  "Babatunde",
  "Emeka",
  "Tunde",
  "Kelechi",
  "Ifeanyi",
  "Adebayo",
  "Segun",
  "Chidi",
  "Nnamdi",
  "Obinna",
  "Uche",
  "Femi",
  "Gbenga",
  "Rotimi",
  "Biodun",
  "Kunle",
  "Dele",
  "Wale",
  "Aminu",
  "Musa",
  "Ibrahim",
  "Suleiman",
  "Abdullahi",
  "Yusuf",
  "Garba",
  "Aliyu",
  "Bello",
  "Usman",
  "Chukwudi",
  "Ikenna",
  "Chibuike",
  "Onyeka",
  "Nwosu",
  "Eze",
  "Obi",
  "Agu",
  "Okafor",
  "Nwachukwu",
];
const firstNamesF = [
  "Ngozi",
  "Adaeze",
  "Chioma",
  "Amaka",
  "Nneka",
  "Ifeoma",
  "Obiageli",
  "Adaora",
  "Chinyere",
  "Ugochi",
  "Folake",
  "Bimpe",
  "Yetunde",
  "Shade",
  "Kemi",
  "Toyin",
  "Funmi",
  "Sade",
  "Bukola",
  "Titi",
  "Fatima",
  "Aisha",
  "Hauwa",
  "Zainab",
  "Maryam",
  "Bilkisu",
  "Ramatu",
  "Hadiza",
  "Safiya",
  "Nana",
  "Ebele",
  "Uloma",
  "Ogochukwu",
  "Adanna",
  "Chinwe",
  "Ogechi",
  "Nkechi",
  "Uju",
  "Ego",
  "Adaeze",
];
const lastNames = [
  "Okonkwo",
  "Adeyemi",
  "Balogun",
  "Nwosu",
  "Eze",
  "Okafor",
  "Nwachukwu",
  "Adeleke",
  "Adesanya",
  "Ogundimu",
  "Babatunde",
  "Olawale",
  "Abiodun",
  "Fashola",
  "Tinubu",
  "Amaechi",
  "Wike",
  "Obi",
  "Atiku",
  "Buhari",
  "Musa",
  "Ibrahim",
  "Suleiman",
  "Abdullahi",
  "Yusuf",
  "Garba",
  "Aliyu",
  "Bello",
  "Usman",
  "Danjuma",
  "Chukwu",
  "Ikenna",
  "Chibuike",
  "Onyeka",
  "Okonkwo",
  "Eze",
  "Obi",
  "Agu",
  "Okafor",
  "Nwachukwu",
  "Adeyinka",
  "Oluwafemi",
  "Akinwale",
  "Adebisi",
  "Oluwakemi",
  "Adewale",
  "Akinola",
  "Adeyemo",
  "Oluwaseyi",
  "Adewumi",
];
const phones = () => `080${randInt(10000000, 99999999)}`;
const cities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Enugu",
  "Benin City",
  "Kaduna",
  "Owerri",
  "Onitsha",
];
const streets = [
  "15 Broad Street",
  "22 Marina Road",
  "7 Adeola Odeku",
  "45 Awolowo Road",
  "3 Nnamdi Azikiwe",
  "18 Herbert Macaulay",
  "9 Bode Thomas",
  "31 Ikorodu Road",
  "12 Agege Motor Road",
  "5 Ojuelegba Road",
];

const conditions = [
  { name: "Hypertension", code: "I10" },
  { name: "Type 2 Diabetes Mellitus", code: "E11" },
  { name: "Malaria", code: "B54" },
  { name: "Peptic Ulcer Disease", code: "K27" },
  { name: "Asthma", code: "J45" },
  { name: "Chronic Kidney Disease", code: "N18" },
  { name: "Heart Failure", code: "I50" },
  { name: "Osteoarthritis", code: "M19" },
  { name: "Anaemia", code: "D64" },
  { name: "Typhoid Fever", code: "A01" },
  { name: "HIV/AIDS", code: "B24" },
  { name: "Tuberculosis", code: "A15" },
  { name: "Epilepsy", code: "G40" },
  { name: "Sickle Cell Disease", code: "D57" },
  { name: "Dyslipidaemia", code: "E78" },
  { name: "Gastroesophageal Reflux Disease", code: "K21" },
  { name: "Urinary Tract Infection", code: "N39" },
  { name: "Depression", code: "F32" },
  { name: "Hypothyroidism", code: "E03" },
  { name: "Benign Prostatic Hyperplasia", code: "N40" },
];

const medications = [
  {
    name: "Amlodipine",
    generic: "Amlodipine",
    strength: "5mg",
    form: "tablet",
    dose: "5",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Hypertension",
  },
  {
    name: "Lisinopril",
    generic: "Lisinopril",
    strength: "10mg",
    form: "tablet",
    dose: "10",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Hypertension",
  },
  {
    name: "Metformin",
    generic: "Metformin HCl",
    strength: "500mg",
    form: "tablet",
    dose: "500",
    unit: "mg",
    route: "oral",
    freq: "Twice daily",
    indication: "Type 2 Diabetes",
  },
  {
    name: "Glibenclamide",
    generic: "Glibenclamide",
    strength: "5mg",
    form: "tablet",
    dose: "5",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Type 2 Diabetes",
  },
  {
    name: "Artemether/Lumefantrine",
    generic: "Artemether/Lumefantrine",
    strength: "20/120mg",
    form: "tablet",
    dose: "4",
    unit: "tablets",
    route: "oral",
    freq: "Twice daily x3 days",
    indication: "Malaria",
  },
  {
    name: "Omeprazole",
    generic: "Omeprazole",
    strength: "20mg",
    form: "capsule",
    dose: "20",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Peptic Ulcer / GERD",
  },
  {
    name: "Salbutamol Inhaler",
    generic: "Salbutamol",
    strength: "100mcg",
    form: "inhaler",
    dose: "2",
    unit: "puffs",
    route: "inhaled",
    freq: "As needed",
    indication: "Asthma",
  },
  {
    name: "Atorvastatin",
    generic: "Atorvastatin",
    strength: "20mg",
    form: "tablet",
    dose: "20",
    unit: "mg",
    route: "oral",
    freq: "Once daily at night",
    indication: "Dyslipidaemia",
  },
  {
    name: "Aspirin",
    generic: "Acetylsalicylic acid",
    strength: "75mg",
    form: "tablet",
    dose: "75",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Cardiovascular prophylaxis",
  },
  {
    name: "Furosemide",
    generic: "Furosemide",
    strength: "40mg",
    form: "tablet",
    dose: "40",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Heart Failure / Oedema",
  },
  {
    name: "Spironolactone",
    generic: "Spironolactone",
    strength: "25mg",
    form: "tablet",
    dose: "25",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Heart Failure",
  },
  {
    name: "Carvedilol",
    generic: "Carvedilol",
    strength: "6.25mg",
    form: "tablet",
    dose: "6.25",
    unit: "mg",
    route: "oral",
    freq: "Twice daily",
    indication: "Heart Failure / Hypertension",
  },
  {
    name: "Ferrous Sulphate",
    generic: "Ferrous Sulphate",
    strength: "200mg",
    form: "tablet",
    dose: "200",
    unit: "mg",
    route: "oral",
    freq: "Twice daily",
    indication: "Iron deficiency anaemia",
  },
  {
    name: "Folic Acid",
    generic: "Folic Acid",
    strength: "5mg",
    form: "tablet",
    dose: "5",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Anaemia / Pregnancy",
  },
  {
    name: "Hydroxyurea",
    generic: "Hydroxyurea",
    strength: "500mg",
    form: "capsule",
    dose: "500",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Sickle Cell Disease",
  },
  {
    name: "Tenofovir/Lamivudine/Efavirenz",
    generic: "TDF/3TC/EFV",
    strength: "300/300/600mg",
    form: "tablet",
    dose: "1",
    unit: "tablet",
    route: "oral",
    freq: "Once daily at night",
    indication: "HIV/AIDS",
  },
  {
    name: "Rifampicin",
    generic: "Rifampicin",
    strength: "600mg",
    form: "tablet",
    dose: "600",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Tuberculosis",
  },
  {
    name: "Phenytoin",
    generic: "Phenytoin",
    strength: "100mg",
    form: "tablet",
    dose: "100",
    unit: "mg",
    route: "oral",
    freq: "Twice daily",
    indication: "Epilepsy",
  },
  {
    name: "Levothyroxine",
    generic: "Levothyroxine",
    strength: "50mcg",
    form: "tablet",
    dose: "50",
    unit: "mcg",
    route: "oral",
    freq: "Once daily fasting",
    indication: "Hypothyroidism",
  },
  {
    name: "Tamsulosin",
    generic: "Tamsulosin",
    strength: "0.4mg",
    form: "capsule",
    dose: "0.4",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Benign Prostatic Hyperplasia",
  },
  {
    name: "Ciprofloxacin",
    generic: "Ciprofloxacin",
    strength: "500mg",
    form: "tablet",
    dose: "500",
    unit: "mg",
    route: "oral",
    freq: "Twice daily x7 days",
    indication: "Urinary Tract Infection",
  },
  {
    name: "Amoxicillin",
    generic: "Amoxicillin",
    strength: "500mg",
    form: "capsule",
    dose: "500",
    unit: "mg",
    route: "oral",
    freq: "Three times daily",
    indication: "Bacterial infection",
  },
  {
    name: "Sertraline",
    generic: "Sertraline",
    strength: "50mg",
    form: "tablet",
    dose: "50",
    unit: "mg",
    route: "oral",
    freq: "Once daily",
    indication: "Depression",
  },
  {
    name: "Diclofenac",
    generic: "Diclofenac sodium",
    strength: "50mg",
    form: "tablet",
    dose: "50",
    unit: "mg",
    route: "oral",
    freq: "Twice daily with food",
    indication: "Osteoarthritis / Pain",
  },
  {
    name: "Calcium Carbonate + Vit D3",
    generic: "Calcium/Cholecalciferol",
    strength: "500mg/200IU",
    form: "tablet",
    dose: "1",
    unit: "tablet",
    route: "oral",
    freq: "Twice daily",
    indication: "Bone health",
  },
];

const allergySubstances = [
  "Penicillin",
  "Sulfonamides",
  "Aspirin",
  "Ibuprofen",
  "Codeine",
  "Latex",
  "Peanuts",
  "Shellfish",
  "Eggs",
  "Dust mites",
  "Pollen",
  "Amoxicillin",
  "Erythromycin",
  "Metronidazole",
  "Tetracycline",
];
const allergyReactions = [
  "Urticaria (hives)",
  "Anaphylaxis",
  "Angioedema",
  "Rash and pruritus",
  "Bronchospasm",
  "Nausea and vomiting",
  "Steven-Johnson syndrome",
  "Fixed drug eruption",
  "Maculopapular rash",
];

const encounterTypes = [
  "initial_consultation",
  "routine_checkup",
  "medication_review",
  "follow_up",
  "counselling",
  "screening",
];
const encounterReasons = [
  "Routine medication review and blood pressure check",
  "Complaint of headache and dizziness",
  "Follow-up on diabetes management",
  "Medication counselling for new prescription",
  "Complaint of chest pain and shortness of breath",
  "Annual health screening",
  "Review of asthma control",
  "Complaint of joint pain",
  "Follow-up on anaemia treatment",
  "Medication reconciliation after hospital discharge",
  "Complaint of persistent cough",
  "Review of antiretroviral therapy",
  "Complaint of abdominal pain",
  "Blood pressure monitoring",
  "Diabetes education session",
];

const observationTypes = [
  { type: "blood_pressure_systolic", unit: "mmHg", min: 100, max: 180 },
  { type: "blood_pressure_diastolic", unit: "mmHg", min: 60, max: 110 },
  { type: "blood_glucose_fasting", unit: "mmol/L", min: 3.5, max: 18 },
  { type: "weight", unit: "kg", min: 45, max: 120 },
  { type: "height", unit: "cm", min: 150, max: 195 },
  { type: "temperature", unit: "°C", min: 36.0, max: 39.5 },
  { type: "pulse_rate", unit: "bpm", min: 55, max: 110 },
  { type: "oxygen_saturation", unit: "%", min: 92, max: 100 },
  { type: "bmi", unit: "kg/m²", min: 17, max: 38 },
];

async function seed() {
  await client.connect();
  console.log("Connected. Starting seed...");

  // Get admin user id
  const adminRes = await client.query(
    `SELECT id FROM users WHERE email = 'admin@pharmacare.local' LIMIT 1`,
  );
  if (!adminRes.rows.length) {
    console.error("Admin user not found. Run migrations first.");
    process.exit(1);
  }
  const adminId = adminRes.rows[0].id;

  // Create 2 extra staff users
  const staffHash = await bcrypt.hash("Staff@123", 12);
  await client.query(
    `
    INSERT INTO users (first_name, last_name, email, password_hash, role)
    VALUES
      ('Ngozi', 'Okonkwo', 'ngozi@pharmacare.local', $1, 'pharmacist'),
      ('Emeka', 'Adeyemi', 'emeka@pharmacare.local', $1, 'assistant')
    ON CONFLICT (email) DO NOTHING
  `,
    [staffHash],
  );
  console.log("✓ Staff users created");

  let patientCount = 0;

  for (let i = 1; i <= 120; i++) {
    const isFemale = randBool(0.52);
    const firstName = rand(isFemale ? firstNamesF : firstNamesM);
    const lastName = rand(lastNames);
    const gender = isFemale ? "female" : "male";
    const dob = dateStr(daysAgo(randInt(365 * 18, 365 * 80)));
    const patientNumber = `PC-2025-${pad(i)}`;
    const registeredDaysAgo = randInt(1, 730);
    const registeredAt = daysAgo(registeredDaysAgo);
    const city = rand(cities);
    const address = `${rand(streets)}, ${city}`;
    const source = rand([
      "walk_in",
      "walk_in",
      "referral",
      "outreach",
      "other",
    ]);
    const allergyStatus = rand([
      "not_assessed",
      "not_assessed",
      "no_known_allergies",
      "allergies_present",
      "allergies_present",
    ]);

    // Insert patient
    const pRes = await client.query(
      `
      INSERT INTO patients (patient_number, first_name, last_name, date_of_birth, gender, status, registration_source, allergy_status, address, registered_at, created_by)
      VALUES ($1,$2,$3,$4,$5,'active',$6,$7,$8,$9,$10)
      RETURNING id
    `,
      [
        patientNumber,
        firstName,
        lastName,
        dob,
        gender,
        source,
        allergyStatus,
        address,
        registeredAt,
        adminId,
      ],
    );
    const patientId = pRes.rows[0].id;

    // Contact
    await client.query(
      `
      INSERT INTO patient_contacts (patient_id, contact_type, value, is_primary)
      VALUES ($1, 'phone', $2, true)
    `,
      [patientId, phones()],
    );

    if (randBool(0.4)) {
      await client.query(
        `
        INSERT INTO patient_contacts (patient_id, contact_type, value, is_primary)
        VALUES ($1, 'email', $2, false)
      `,
        [
          patientId,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 99)}@gmail.com`,
        ],
      );
    }

    // Emergency contact
    if (randBool(0.7)) {
      const ecNames = ["Spouse", "Parent", "Sibling", "Child"];
      await client.query(
        `
        INSERT INTO emergency_contacts (patient_id, name, relationship, phone)
        VALUES ($1, $2, $3, $4)
      `,
        [
          patientId,
          `${rand(firstNamesM)} ${lastName}`,
          rand(ecNames),
          phones(),
        ],
      );
    }

    // Conditions (1-4 per patient, weighted toward common ones)
    const numConditions = rand([1, 1, 1, 2, 2, 3, 4]);
    const patientConditions = [...conditions]
      .sort(() => Math.random() - 0.5)
      .slice(0, numConditions);
    for (const cond of patientConditions) {
      const onsetDaysAgo = randInt(30, 365 * 10);
      await client.query(
        `
        INSERT INTO medical_conditions (patient_id, condition_name, code_system, code, status, onset_date, severity, source, verification_status, recorded_by)
        VALUES ($1,$2,'ICD-10',$3,$4,$5,$6,$7,$8,$9)
      `,
        [
          patientId,
          cond.name,
          cond.code,
          rand(["current", "current", "current", "resolved", "in_remission"]),
          dateStr(daysAgo(onsetDaysAgo)),
          rand(["mild", "moderate", "moderate", "severe"]),
          rand(["patient_reported", "clinician_document", "patient_reported"]),
          rand(["unverified", "reviewed", "confirmed"]),
          adminId,
        ],
      );
    }

    // Allergies
    if (allergyStatus === "allergies_present") {
      const numAllergies = randInt(1, 3);
      const substances = [...allergySubstances]
        .sort(() => Math.random() - 0.5)
        .slice(0, numAllergies);
      for (const substance of substances) {
        await client.query(
          `
          INSERT INTO patient_allergies (patient_id, substance, classification, reaction, severity, status, source, verification_status, recorded_by)
          VALUES ($1,$2,$3,$4,$5,'active',$6,$7,$8)
        `,
          [
            patientId,
            substance,
            rand([
              "confirmed_allergy",
              "suspected_allergy",
              "intolerance",
              "adverse_reaction",
            ]),
            rand(allergyReactions),
            rand(["mild", "moderate", "severe"]),
            rand(["patient_reported", "clinician_document"]),
            rand(["unverified", "confirmed"]),
            adminId,
          ],
        );
      }
    }

    // Medications (1-6 per patient, polypharmacy for ~15%)
    const isPolypharmacy = randBool(0.15);
    const numMeds = isPolypharmacy ? randInt(5, 8) : randInt(1, 4);
    const patientMeds = [...medications]
      .sort(() => Math.random() - 0.5)
      .slice(0, numMeds);
    for (const med of patientMeds) {
      const startDaysAgo = randInt(7, 365 * 3);
      const status = rand([
        "active",
        "active",
        "active",
        "discontinued",
        "completed",
      ]);
      await client.query(
        `
        INSERT INTO patient_medications
          (patient_id, medicine_name_snapshot, generic_name_snapshot, strength_snapshot, dosage_form_snapshot,
           dose_amount, dose_unit, route, frequency, indication, start_date, status, source, recorded_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      `,
        [
          patientId,
          med.name,
          med.generic,
          med.strength,
          med.form,
          med.dose,
          med.unit,
          med.route,
          med.freq,
          med.indication,
          dateStr(daysAgo(startDaysAgo)),
          status,
          rand(["patient_reported", "clinician_document"]),
          adminId,
        ],
      );
    }

    // Encounters (0-6 per patient)
    const numEncounters = rand([0, 1, 1, 2, 2, 3, 4, 5, 6]);
    let lastEncounterId: string | null = null;
    for (let e = 0; e < numEncounters; e++) {
      const encDaysAgo = randInt(1, registeredDaysAgo);
      const encType = rand(encounterTypes);
      const encStatus = rand([
        "completed",
        "completed",
        "completed",
        "in_progress",
      ]);
      const encRes = await client.query(
        `
        INSERT INTO encounters
          (patient_id, encounter_number, encounter_type, status, reason, clinical_notes, started_at, completed_at, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id
      `,
        [
          patientId,
          `ENC-${patientNumber}-${String(e + 1).padStart(2, "0")}`,
          encType,
          encStatus,
          rand(encounterReasons),
          randBool(0.6)
            ? `Patient reviewed. ${rand(["Medications adjusted.", "Counselling provided.", "Referral discussed.", "Monitoring plan updated.", "Patient education given."])}`
            : null,
          daysAgo(encDaysAgo),
          encStatus === "completed" ? daysAgo(encDaysAgo - 1) : null,
          adminId,
        ],
      );
      lastEncounterId = encRes.rows[0].id;

      // Observations per encounter
      const obsTypes = [...observationTypes]
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(2, 5));
      for (const obs of obsTypes) {
        const val = (Math.random() * (obs.max - obs.min) + obs.min).toFixed(1);
        await client.query(
          `
          INSERT INTO observations (patient_id, encounter_id, observation_type, value_numeric, unit, measured_at, source, recorded_by)
          VALUES ($1,$2,$3,$4,$5,$6,'clinician_document',$7)
        `,
          [
            patientId,
            lastEncounterId,
            obs.type,
            val,
            obs.unit,
            daysAgo(encDaysAgo),
            adminId,
          ],
        );
      }
    }

    // Follow-ups (0-3 per patient)
    const numFollowUps = rand([0, 0, 1, 1, 2, 3]);
    for (let f = 0; f < numFollowUps; f++) {
      const dueDaysFromNow = randInt(-30, 60); // some overdue, some upcoming
      const fuStatus =
        dueDaysFromNow < -7
          ? rand(["missed", "completed"])
          : dueDaysFromNow < 0
            ? rand(["due", "missed"])
            : "scheduled";
      await client.query(
        `
        INSERT INTO follow_ups (patient_id, related_encounter_id, reason, due_at, status, created_by)
        VALUES ($1,$2,$3,$4,$5,$6)
      `,
        [
          patientId,
          lastEncounterId,
          rand([
            "Blood pressure review",
            "Diabetes monitoring",
            "Medication review",
            "Lab result review",
            "Post-discharge follow-up",
            "Adherence check",
            "Symptom review",
          ]),
          daysAgo(-dueDaysFromNow),
          fuStatus,
          adminId,
        ],
      );
    }

    patientCount++;
    if (patientCount % 20 === 0)
      console.log(`  ${patientCount} patients seeded...`);
  }

  await client.end();
  console.log(
    `\n✓ Seed complete: ${patientCount} patients with conditions, allergies, medications, encounters, observations, and follow-ups.`,
  );
  console.log("\nLogin credentials:");
  console.log("  admin@pharmacare.local  /  password");
  console.log("  ngozi@pharmacare.local  /  Staff@123");
  console.log("  emeka@pharmacare.local  /  Staff@123");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
