const express = require('express');
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/analyticsController');

const router = express.Router();

router.use(auth);
router.get('/analytics', controller.analytics);
router.get('/macro-analysis', controller.macroAnalysis);
router.get('/nutrition-score', controller.nutritionScore);

module.exports = router;
