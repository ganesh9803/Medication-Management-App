//routes/index.js

import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import {
  getMedications,
  markAdherence,
  assignCaretaker,
  uploadAdherenceProof,
  getMyPatientProfile,
  getAdherenceAnalytics as getPatientAdherenceAnalytics
} from '../controllers/patient.controller.js';
import {
  getCaretakers,
  getPatients,
  assignMedication,
  updateMedication,
  deleteMedication,
  getMyCaretakerProfile,
  getAdherenceAnalytics as getCaretakerAdherenceAnalytics
} from '../controllers/caretaker.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Auth routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// Patient routes
router.get('/patient/medications', authenticate, authorize('PATIENT'), getMedications);
router.patch('/patient/adherence', authenticate, authorize('PATIENT'), markAdherence);
router.patch('/patient/select-caretaker', authenticate, authorize('PATIENT'), assignCaretaker);
router.post('/patient/adherence/proof', authenticate, authorize('PATIENT'), upload.single('proof'), uploadAdherenceProof);
router.get('/patient/adherence/analytics', authenticate, authorize('PATIENT'), getPatientAdherenceAnalytics);
router.get('/patient/profile', authenticate, authorize('PATIENT'), getMyPatientProfile);


// Caretaker routes
router.get('/caretaker/profile', authenticate, getMyCaretakerProfile);
router.get('/caretakers', authenticate, getCaretakers);
router.get('/caretaker/patients', authenticate, authorize('CARETAKER'), getPatients);
router.post('/caretaker/medications', authenticate, authorize('CARETAKER'), assignMedication);
router.patch('/caretaker/medications/update', authenticate, authorize('CARETAKER'), updateMedication);
router.get('/caretaker/adherence/analytics', authenticate, authorize('CARETAKER'), getCaretakerAdherenceAnalytics);
router.delete('/caretaker/medications/:medicationId', authenticate, authorize('CARETAKER'), deleteMedication);

export default router;
