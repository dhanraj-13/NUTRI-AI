const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const controller = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.get('/profile', auth, controller.profile);

module.exports = router;
