module.exports =
(req, res, next) => {

  res.setHeader(
    'X-Frame-Options',
    'DENY'
  );

  res.setHeader(
    'X-Content-Type-Options',
    'nosniff'
  );

  next();

};
