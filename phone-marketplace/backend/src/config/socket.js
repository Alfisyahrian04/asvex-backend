const { Server } =
require('socket.io');

const jwt =
require('jsonwebtoken');

module.exports =
server => {

  const io =
  new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.use((socket, next) => {

    try {

      const token =
      socket.handshake.auth.token;

      const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      next();

    } catch (err) {

      next(
        new Error('Unauthorized')
      );

    }

  });

  io.on(
    'connection',
    socket => {

      socket.on(
        'join_room',
        room => {

          socket.join(room);

        }
      );

      socket.on(
        'send_message',
        data => {

          io.to(data.room)
          .emit(
            'receive_message',
            data
          );

        }
      );

    }
  );

};
