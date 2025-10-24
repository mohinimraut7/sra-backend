
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.viewProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/users', authMiddleware, authController.getAllUsersWithLastLogin);

module.exports = router;
