const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createAgreement,
  getUserAgreements,
  getAgreementById,
  getAgreementByToken,
  markAgreementAsViewed,
  signAgreement,
  updateAgreementStatus,
  deleteAgreement,
  sendAgreementSMSController
} = require('../controllers/agreementController');

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authenticateToken, createAgreement);
router.get('/user', authenticateToken, getUserAgreements);
router.get('/:id', authenticateToken, getAgreementById);
router.put('/:id/status', authenticateToken, updateAgreementStatus);
router.delete('/:id', authenticateToken, deleteAgreement);
router.post('/:id/send-sms', authenticateToken, sendAgreementSMSController);

// Public routes (no authentication required)
router.get('/public/:token', getAgreementByToken);
router.post('/public/:token/view', markAgreementAsViewed);
router.post('/public/:token/sign', signAgreement);

module.exports = router;