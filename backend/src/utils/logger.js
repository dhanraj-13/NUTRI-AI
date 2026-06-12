const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR'
};

const log = (level, message, meta = {}) => {
  const payload = {
    level: levels[level] || levels.info,
    ts: new Date().toISOString(),
    message,
    ...meta
  };
  // Structured JSON logs for easier production parsing.
  console.log(JSON.stringify(payload));
};

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta)
};
