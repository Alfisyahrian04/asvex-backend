const redis =
require('../config/redis');

exports.cache =
async ({
  key,
  value,
  ttl = 300
}) => {

  await redis.set(

    key,

    JSON.stringify(value),

    'EX',

    ttl

  );

};

exports.getCache =
async key => {

  const data =
    await redis.get(key);

  return data
    ? JSON.parse(data)
    : null;

};
