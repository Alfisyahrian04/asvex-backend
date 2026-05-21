const {
  webhookQueue
} = require('../config/queue');

webhookQueue.process(
async job => {

  try {

    console.log(
      'Retry webhook'
    );

  } catch (err) {

    throw err;

  }

});
