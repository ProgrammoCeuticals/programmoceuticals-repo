import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getEncounter, updateEncounter, amendEncounter,
  addObservation, addAssessment, addCarePlan, addIntervention,
} from '../controllers/encounter.controller';

const router = Router();
router.use(authenticate);

router.get('/:id', getEncounter);
router.put('/:id', authorize('admin', 'pharmacist'), updateEncounter);
router.post('/:id/amend', authorize('admin', 'pharmacist'), amendEncounter);
router.post('/:encounterId/observations', authorize('admin', 'pharmacist'), addObservation);
router.post('/:encounterId/assessments', authorize('admin', 'pharmacist'), addAssessment);
router.post('/:encounterId/care-plans', authorize('admin', 'pharmacist'), addCarePlan);
router.post('/:encounterId/interventions', authorize('admin', 'pharmacist'), addIntervention);

export default router;
