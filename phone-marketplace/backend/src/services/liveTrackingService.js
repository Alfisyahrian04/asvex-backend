exports.emitTracking =
({
  io,
  orderId,
  payload
}) => {

  io.to(
    `order:${orderId}`
  ).emit(
    'tracking-update',
    payload
  );

};
