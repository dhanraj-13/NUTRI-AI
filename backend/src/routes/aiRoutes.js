const express = require('express');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { recommendationQuerySchema } = require('../validators/aiValidators');
const controller = require('../controllers/aiController');

const router = express.Router();

router.use(auth);
router.get('/recommendations', validate(recommendationQuerySchema, 'query'), controller.recommendations);
router.get('/nutrition-analysis', controller.nutritionAnalysis);
router.get('/hydration-analysis', controller.hydrationAnalysis);
router.get('/focus-foods', validate(recommendationQuerySchema, 'query'), controller.focusFoods);

module.exports = router;
