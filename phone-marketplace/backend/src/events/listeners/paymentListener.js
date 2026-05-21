const emitter =
require('../orderEvents');

emitter.on(
  'PAYMENT_SUCCESS',
  async payload => {

    console.log(
      'Payment success:',
      payload
    );

  }
);
