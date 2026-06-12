const http = require('http');
const app = require('./app');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const initSocket = require('./src/sockets');
const { bootstrapNutritionData } = require('./src/jobs/bootstrapJob');

const server = http.createServer(app);
initSocket(server);

server.listen(config.port, async () => {
  try {
    const bootstrap = await bootstrapNutritionData();
    logger.info('Nutrition backend started', { port: config.port, bootstrap });
  } catch (error) {
    logger.error('Startup bootstrap failed', { message: error.message });
  }
});

module.exports = server;
