const Review =
require('../models/Review');

const Product =
require('../models/Product');

exports.createReview =
async (req, res) => {

  try {

    const {

      productId,

      rating,

      comment

    } = req.body;

    const review =
      await Review.create({

        productId,

        buyerId:
          req.user._id,

        rating,

        comment

      });

    const reviews =
      await Review.find({
        productId
      });

    const total =
      reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      );

    const average =
      total / reviews.length;

    await Product.findByIdAndUpdate(
      productId,
      {

        rating: average,

        totalReview:
          reviews.length

      }
    );

    res.json({

      success: true,

      review

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
