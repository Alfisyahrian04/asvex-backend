const Order =
require('../models/Order');

module.exports =
async (req, res, next) => {

  const key =
    req.headers[
      'x-idempotency-key'
    ];

  if (!key) {

    return res.status(400)
    .json({
      success: false,
      message:
        'Missing idempotency key'
    });

  }

  const existing =
    await Order.findOne({
      idempotencyKey: key
    });

  if (existing) {

    return res.status(409)
    .json({
      success: false,
      message:
        'Duplicate transaction'
    });

  }

  req.idempotencyKey = key;

  next();

};
