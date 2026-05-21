const User =
require('../models/User');

const Product =
require('../models/Product');

const Order =
require('../models/Order');

exports.dashboard =
async (req, res) => {

  try {

    const users =
      await User.countDocuments();

    const products =
      await Product.countDocuments();

    const orders =
      await Order.countDocuments();

    const revenueData =
      await Order.find();

    const revenue =
      revenueData.reduce(
        (acc, item) =>
          acc + item.total,
        0
      );

    res.json({

      success: true,

      users,

      products,

      orders,

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
