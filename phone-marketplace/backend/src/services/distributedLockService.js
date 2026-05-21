const Redis =
require('ioredis');

const redis =
new Redis(
  process.env.REDIS_URL
);

exports.acquireLock =
async key => {

  return await redis.set(

    key,

    'locked',

    'NX',

    'EX',

    10

  );

};
