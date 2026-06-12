let ioRef = null;

const setIo = (io) => {
  ioRef = io;
};

const emitToUser = (userId, event, payload) => {
  if (!ioRef) return;
  ioRef.to(`user:${userId}`).emit(event, payload);
};

module.exports = { setIo, emitToUser };
