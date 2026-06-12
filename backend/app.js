const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./src/config/env');
const sanitize = require('./src/middleware/sanitizeMiddleware');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const logRoutes = require('./src/routes/logRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const exportRoutes = require('./src/routes/exportRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(sanitize);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    datasetRoot: config.datasetRoot,
    exportsRoot: config.exportsRoot
  });
});

app.use(authRoutes);
app.use(nutritionRoutes);
app.use(logRoutes);
app.use(aiRoutes);
app.use(analyticsRoutes);
app.use(exportRoutes);

app.use('/api', authRoutes);
app.use('/api', nutritionRoutes);
app.use('/api', logRoutes);
app.use('/api', aiRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', exportRoutes);

app.use(errorHandler);

module.exports = app;
