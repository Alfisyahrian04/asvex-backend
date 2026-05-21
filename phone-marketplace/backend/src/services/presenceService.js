exports.userOnline =
({
  io,
  userId
}) => {

  io.emit(
    'presence',
    {

      userId,

      online: true

    }
  );

};
