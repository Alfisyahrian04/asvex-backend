const Bull =
require('bull');

const queues = {

  paymentQueue:
    new Bull(
      'payment-queue',
      process.env.REDIS_URL
    ),

  emailQueue:
    new Bull(
      'email-queue',
      process.env.REDIS_URL
    ),

  notificationQueue:
    new Bull(
      'notification-queue',
      process.env.REDIS_URL
    )

};

module.exports = queues;
