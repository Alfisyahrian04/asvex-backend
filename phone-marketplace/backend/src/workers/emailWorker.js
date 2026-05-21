const {
  emailQueue
} = require('../config/queue');

emailQueue.process(
async job => {

  console.log(
    'Sending email:',
    job.data
  );

});
