exports.generateFingerprint =
({
  ip,
  userAgent
}) => {

  return Buffer

    .from(
      ip + userAgent
    )

    .toString('base64');

};
