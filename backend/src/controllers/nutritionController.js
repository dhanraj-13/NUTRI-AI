const multer = require('multer');
const path = require('path');
const { importNutritionCsv } = require('../services/nutritionImportService');
const { listFoods, getFoodById } = require('../services/nutritionQueryService');
const config = require('../config/env');

const upload = multer({ dest: path.resolve(__dirname, '../uploads') });

const importFoods = async (req, res, next) => {
  try {
    const csvPath = req.file?.path || config.nutritionCsvWithImages;
    res.status(200).json({ success: true, data: await importNutritionCsv(csvPath) });
  } catch (e) { next(e); }
};

const foods = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await listFoods(req.query) }); } catch (e) { next(e); }
};

const foodById = async (req, res, next) => {
  try {
    const row = await getFoodById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Food not found' });
    return res.status(200).json({ success: true, data: row });
  } catch (e) { next(e); }
};

module.exports = { upload, importFoods, foods, foodById };
