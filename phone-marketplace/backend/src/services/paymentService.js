exports.createPayment =
async ({
  amount,
  method
}) => {

  return {

    paymentUrl:
      'https://payment-url.com',

    amount,

    method,

    expiredAt:
      Date.now() + 86400000

  };

};
