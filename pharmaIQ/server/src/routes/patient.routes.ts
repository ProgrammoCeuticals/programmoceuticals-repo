import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createPatient, getPatients, getPatient, updatePatient, archivePatient,
} from '../controllers/patient.controller';
import {
  getConditions, addCondition, updateCondition,
  getAllergies, addAllergy, updateAllergy, setAllergyStatus,
  getFamilyHistory, addFamilyHistory,
  getSocialHistory, addSocialHistory,
  getProcedures, addProcedure,
  getHospitalisations, addHospitalisation,
} from '../controllers/history.controller';
import {
  getMedications, addMedication, changeMedication, getMedicationHistory,
  addMedicationReview, getMedicationReviews,
} from '../controllers/medication.controller';
import {
  getEncounters, createEncounter, getEncounter, updateEncounter, amendEncounter,
  addObservation, addAssessment, addCarePlan, addIntervention,
  getPatientObservations, addPatientObservation,
} from '../controllers/encounter.controller';
import { getFollowUps, createFollowUp, updateFollowUp } from '../controllers/followup.controller';
import { getTestOrders, createTestOrder, getTestResults, addTestResult } from '../controllers/test.controller';
import { getTimeline, getPatientSummary } from '../controllers/summary.controller';

const router = Router();
router.use(authenticate);

// ─── Patients ─────────────────────────────────────────────────────────────────
router.get('/', getPatients);
router.post('/', authorize('admin', 'pharmacist', 'assistant'), createPatient);
router.get('/:id', getPatient);
router.put('/:id', authorize('admin', 'pharmacist', 'assistant'), updatePatient);
router.delete('/:id', authorize('admin'), archivePatient);

// ─── Medical history ──────────────────────────────────────────────────────────
router.get('/:patientId/medical-conditions', getConditions);
router.post('/:patientId/medical-conditions', authorize('admin', 'pharmacist'), addCondition);
router.put('/:patientId/medical-conditions/:id', authorize('admin', 'pharmacist'), updateCondition);

router.get('/:patientId/allergies', getAllergies);
router.post('/:patientId/allergies', authorize('admin', 'pharmacist'), addAllergy);
router.put('/:patientId/allergies/:id', authorize('admin', 'pharmacist'), updateAllergy);
router.put('/:patientId/allergy-status', authorize('admin', 'pharmacist'), setAllergyStatus);

router.get('/:patientId/family-history', getFamilyHistory);
router.post('/:patientId/family-history', authorize('admin', 'pharmacist'), addFamilyHistory);

router.get('/:patientId/social-history', getSocialHistory);
router.post('/:patientId/social-history', authorize('admin', 'pharmacist'), addSocialHistory);

router.get('/:patientId/procedures', getProcedures);
router.post('/:patientId/procedures', authorize('admin', 'pharmacist'), addProcedure);

router.get('/:patientId/hospitalisations', getHospitalisations);
router.post('/:patientId/hospitalisations', authorize('admin', 'pharmacist'), addHospitalisation);

// ─── Medications ──────────────────────────────────────────────────────────────
router.get('/:patientId/medications', getMedications);
router.post('/:patientId/medications', authorize('admin', 'pharmacist'), addMedication);
router.put('/:patientId/medications/:id/change', authorize('admin', 'pharmacist'), changeMedication);
router.get('/:patientId/medications/:id/history', getMedicationHistory);
router.get('/:patientId/medication-reviews', getMedicationReviews);
router.post('/:patientId/medication-reviews', authorize('admin', 'pharmacist'), addMedicationReview);

// ─── Observations (standalone, not tied to encounter) ────────────────────────
router.get('/:patientId/observations', getPatientObservations);
router.post('/:patientId/observations', authorize('admin', 'pharmacist'), addPatientObservation);

// ─── Encounters ───────────────────────────────────────────────────────────────
router.get('/:patientId/encounters', getEncounters);
router.post('/:patientId/encounters', authorize('admin', 'pharmacist'), createEncounter);

// ─── Test orders & results ────────────────────────────────────────────────────
router.get('/:patientId/test-orders', getTestOrders);
router.post('/:patientId/test-orders', authorize('admin', 'pharmacist'), createTestOrder);
router.get('/:patientId/test-results', getTestResults);
router.post('/:patientId/test-results', authorize('admin', 'pharmacist'), addTestResult);

// ─── Follow-ups ───────────────────────────────────────────────────────────────
router.get('/:patientId/follow-ups', getFollowUps);
router.post('/:patientId/follow-ups', authorize('admin', 'pharmacist', 'assistant'), createFollowUp);

// ─── Timeline & summary ───────────────────────────────────────────────────────
router.get('/:patientId/timeline', getTimeline);
router.get('/:patientId/summary', authorize('admin', 'pharmacist'), getPatientSummary);

export default router;
