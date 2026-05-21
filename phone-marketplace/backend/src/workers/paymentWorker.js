const {
  paymentQueue
} = require('../config/queue');

paymentQueue.process(
async job => {

  const data =
    job.data;

  console.log(
    'Processing payment:',
    data
  );

});
