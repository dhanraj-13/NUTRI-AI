const express = require('express');
const validate = require('../middleware/validate');
const { foodFilterSchema } = require('../validators/nutritionValidators');
const controller = require('../controllers/nutritionController');

const router = express.Router();

router.get('/foods', validate(foodFilterSchema, 'query'), controller.foods);
router.get('/foods/search', validate(foodFilterSchema, 'query'), controller.foods);
router.get('/foods/filter', validate(foodFilterSchema, 'query'), controller.foods);
router.get('/foods/:id', controller.foodById);
router.post('/foods/import', controller.upload.single('file'), controller.importFoods);

module.exports = router;
