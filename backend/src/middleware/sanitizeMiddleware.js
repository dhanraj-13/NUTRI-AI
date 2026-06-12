const logger = require('../utils/logger');

const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [k, v]) => {
      if (k.startsWith('$') || k.includes('.')) return acc;
      acc[k] = sanitize(v);
      return acc;
    }, {});
  }
  if (typeof value === 'string') {
    return value.replace(/[<>]/g, '').trim();
  }
  return value;
};

module.exports = (req, res, next) => {
  try {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
  } catch (error) {
    logger.error('Sanitization failure', { error: error.message });
    next(error);
  }
};
