const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');
const { nutritionLogSchema, updateLogSchema } = require('../validators/logValidators');
const controller = require('../controllers/logController');

const router = express.Router();

router.use(auth);
router.post('/nutrition-log', validate(nutritionLogSchema), controller.create);
router.get('/nutrition-log', controller.list);
router.put('/nutrition-log/:id', validate(updateLogSchema), controller.update);
router.delete('/nutrition-log/:id', controller.remove);

module.exports = router;
