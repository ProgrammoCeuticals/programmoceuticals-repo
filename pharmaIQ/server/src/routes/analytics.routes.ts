import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getPopulationHealth,
  getHighRiskPatients,
  getConditionPrevalence,
  getEncounterVolume,
  getRegistrationTrend,
  getObservationTrends,
  getPolypharmacyPatients,
  getFollowUpCompliance,
} from '../controllers/analytics.controller';

const router = Router();
router.use(authenticate);

router.get('/population-health', getPopulationHealth);
router.get('/high-risk', getHighRiskPatients);
router.get('/condition-prevalence', getConditionPrevalence);
router.get('/encounter-volume', getEncounterVolume);
router.get('/registration-trend', getRegistrationTrend);
router.get('/observation-trends/:patientId', getObservationTrends);
router.get('/polypharmacy', getPolypharmacyPatients);
router.get('/followup-compliance', getFollowUpCompliance);

export default router;
