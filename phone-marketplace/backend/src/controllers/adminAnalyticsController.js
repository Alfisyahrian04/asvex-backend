const Order =
require('../models/Order');

exports.analytics =
async (req, res) => {

  const revenue =
    await Order.aggregate([

      {

        $group: {

          _id: null,

          total: {

            $sum: '$total'

          }

        }

      }

    ]);

  res.json({
    revenue
  });

};
