const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const sraFormLogsController = require('../controllers/sraFormLogsController');
const upload = require('../middleware/uploadSRA');



router.post(
  '/submit-log',
  authMiddleware,
  upload.fields([

    { name: 'photo_self' },
    { name: 'photo_family' },
    { name: 'biometric' },
    { name: 'doc_front_view' },
    { name: 'doc_side_view' },
    { name: 'video_inside' },
    { name: 'video_self_declaration' },
    { name: 'adivashihutimage' },
    { name: 'doc_before_2000' },
    { name: 'submitted_docs_before_2000' },
    { name: 'description_doc_before_2000' },
    { name: 'after_2000_proof_submitted' },
    { name: 'possession_doc_info' },
    { name: 'Seldeclaration_letter' },
    { name: 'Ration_card_info' },
    { name: 'Voter_card_info' },
    { name: 'Other_doc_info' }
  ]),
  sraFormLogsController.submitSRAFormLog
);


router.get('/all-logs', authMiddleware, sraFormLogsController.getSRAFormLogs);

router.put(
  '/sra-form-logs/:id',
  authMiddleware,
  upload.fields([
    { name: 'photo_self' },
    { name: 'photo_family' },
    { name: 'biometric' },
    { name: 'doc_front_view' },
    { name: 'doc_side_view' },
    { name: 'video_inside' },
    { name: 'video_self_declaration' },
    { name: 'adivashihutimage' },
    { name: 'doc_before_2000' },
    { name: 'submitted_docs_before_2000' },
    { name: 'description_doc_before_2000' },
    { name: 'after_2000_proof_submitted' },
    { name: 'possession_doc_info' },
    { name: 'Seldeclaration_letter' },
    { name: 'Ration_card_info' },
    { name: 'Voter_card_info' },
    { name: 'Other_doc_info' },
  ]),
  sraFormLogsController.updateSRAFormLog
);


router.get('/dashboard-stats', authMiddleware, sraFormLogsController.getSRADashboardStats);

module.exports = router;
