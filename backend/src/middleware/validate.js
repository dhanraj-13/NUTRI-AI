const { ZodError } = require('zod');
const AppError = require('../utils/appError');

const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError('Validation failed', 400, error.flatten()));
    }
    return next(error);
  }
};

module.exports = validate;
