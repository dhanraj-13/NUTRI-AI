const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const datasetRoot = process.env.DATASET_ROOT || 'E:/dhanraj/AI productivity agent/dataset/nutrition_project';
const exportsRoot = process.env.EXPORTS_ROOT || path.join(datasetRoot, 'exports');

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'development_secret',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  datasetRoot,
  exportsRoot,
  nutritionCsv: path.join(datasetRoot, 'nutrition_dataset.csv'),
  nutritionCsvWithImages: path.join(datasetRoot, 'nutrition_dataset_with_images.csv')
};
