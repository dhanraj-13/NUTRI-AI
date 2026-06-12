const express = require('express');
const auth = require('../middleware/authMiddleware');
const { exportCsv } = require('../controllers/exportController');

const router = express.Router();

router.use(auth);
router.get('/exports/csv', exportCsv);

module.exports = router;
