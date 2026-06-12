const { Server } = require('socket.io');
const { setIo } = require('./socketBus');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('join_user_room', (userId) => socket.join(`user:${userId}`));
    socket.on('nutrition_ping', () => socket.emit('nutrition_pong', { ts: new Date().toISOString() }));
  });

  setIo(io);
  return io;
};

module.exports = initSocket;
