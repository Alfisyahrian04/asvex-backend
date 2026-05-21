const Product =
require('../models/Product');

exports.searchProducts =
async (req, res) => {

  try {

    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (keyword) {

      query.$text = {
        $search: keyword
      };

    }

    if (category) {
      query.category = category;
    }

    if (
      minPrice &&
      maxPrice
    ) {

      query.price = {

        $gte:
          Number(minPrice),

        $lte:
          Number(maxPrice)

      };

    }

    let products =
      Product.find(query);

    if (sort === 'latest') {

      products =
        products.sort({
          createdAt: -1
        });

    }

    if (sort === 'cheap') {

      products =
        products.sort({
          price: 1
        });

    }

    if (sort === 'expensive') {

      products =
        products.sort({
          price: -1
        });

    }

    const result =
      await products
      .skip(
        (page - 1) * limit
      )
      .limit(Number(limit));

    res.json({

      success: true,

      data: result

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
