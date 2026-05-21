const Product =
require('../models/Product');

const Order =
require('../models/Order');

exports.dashboard =
async (req, res) => {

  try {

    const products =
      await Product.countDocuments({

        sellerId:
          req.user._id

      });

    const orders =
      await Order.find({

        'items.sellerId':
          req.user._id

      });

    const revenue =
      orders.reduce(
        (acc, item) =>
          acc + item.total,
        0
      );

    res.json({

      success: true,

      products,

      totalOrders:
        orders.length,

      revenue

    });

  } catch (err) {

    res.status(500)
    .json({

      success: false,

      message:
        err.message

    });

  }

};
