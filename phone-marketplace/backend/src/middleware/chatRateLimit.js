const memory =
new Map();

module.exports =
(req, res, next) => {

  const key =
    req.user._id.toString();

  const now =
    Date.now();

  if (!memory.has(key)) {
    memory.set(key, []);
  }

  const recent =
    memory.get(key)
    .filter(
      time =>
        now - time < 5000
    );

  if (
    recent.length >= 5
  ) {

    return res.status(429)
    .json({

      success: false,

      message:
        'Terlalu banyak pesan'

    });

  }

  recent.push(now);

  memory.set(
    key,
    recent
  );

  next();

};
