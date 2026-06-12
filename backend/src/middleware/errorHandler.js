const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(err.message, {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    details: err.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    details: err.details || undefined
  });
};

module.exports = errorHandler;
