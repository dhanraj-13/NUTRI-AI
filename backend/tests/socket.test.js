const http = require('http');
const ioClient = require('socket.io-client');
const app = require('../app');
const initSocket = require('../src/sockets');

describe('socket', () => {
  test('connect + ping/pong', (done) => {
    const server = http.createServer(app);
    initSocket(server);

    server.listen(0, () => {
      const port = server.address().port;
      const client = ioClient(`http://localhost:${port}`);
      client.on('connect', () => client.emit('nutrition_ping'));
      client.on('nutrition_pong', () => {
        client.close();
        server.close();
        done();
      });
    });
  });
});
