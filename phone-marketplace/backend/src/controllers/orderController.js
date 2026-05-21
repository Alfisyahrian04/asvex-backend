const Order =
require('../models/Order');

exports.createOrder =
async (req, res) => {

  const order =
    await Order.create({

      ...req.body,

      orderId:
        'INV-' + Date.now(),

      buyerId:
        req.user._id,

      buyerName:
        req.user.username,

      idempotencyKey:
        req.idempotencyKey

    });

  res.json(order);

};
