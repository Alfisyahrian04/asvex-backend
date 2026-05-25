const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      shippingAddress,
      paymentMethod,
      paymentProof,
      shippingCourier,
      shippingCost,
      variant
    } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: 'Data order tidak lengkap'
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    if (variant && product.variants?.length) {
      const selectedVariant = product.variants.find(
        v =>
          v._id?.toString() ===
          variant._id?.toString()
      );

      if (
        selectedVariant &&
        selectedVariant.stock < quantity
      ) {
        return res.status(400).json({
          message: 'Stock varian tidak cukup'
        });
      }
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'Stock produk tidak cukup'
      });
    }

    const totalPrice =
      (product.price * quantity) +
      Number(shippingCost || 0);

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      quantity,
      totalPrice,

      shippingAddress:
        shippingAddress || '',

      paymentMethod:
        paymentMethod || '',

      paymentProof:
        paymentProof || '',

      shippingCourier:
        shippingCourier || '',

      shippingCost:
        Number(shippingCost || 0),

      variant:
        variant || {},

      status:
        'waiting_payment_verification',

      paymentStatus:
        'waiting_verification'
    });

    product.stock =
      Math.max(
        0,
        product.stock - quantity
      );

    if (
      variant &&
      product.variants?.length
    ) {
      product.variants =
        product.variants.map(v => {
          if (
            v._id?.toString() ===
            variant._id?.toString()
          ) {
            v.stock =
              Math.max(
                0,
                (v.stock || 0) - quantity
              );
          }

          return v;
        });
    }

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Checkout berhasil',
      order
    });

  } catch (error) {

    console.error(
      'CREATE ORDER ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET MY ORDERS */

exports.getMyOrders = async (req, res) => {
  try {

    const orders =
      await Order.find({
        buyer: req.user._id
      })
      .populate('product')
      .populate('seller', 'username')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* SELLER ORDERS */

exports.getSellerOrders = async (req, res) => {
  try {

    const orders =
      await Order.find({
        seller: req.user._id
      })
      .populate('product')
      .populate('buyer', 'username')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* VERIFY PAYMENT */

exports.verifyPayment = async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.status = 'paid';
    order.paymentStatus = 'paid';
    order.paymentVerifiedAt = new Date();

    await order.save();

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/* SHIP ORDER */

exports.shipOrder = async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.trackingNumber =
      req.body.trackingNumber || '';

    order.shippingPhoto =
      req.body.shippingPhoto || '';

    order.status = 'shipped';

    await order.save();

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/* UPDATE STATUS */

exports.updateOrderStatus = async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    if (
      order.seller.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    order.status =
      req.body.status ||
      order.status;

    await order.save();

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


exports.completeOrder = async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.status = 'completed';
    order.completedAt = new Date();

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.cancelOrder = async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.status = 'cancelled';

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.requestReturn = async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.returnStatus = 'requested';

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.submitDispute = async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order tidak ditemukan'
      });
    }

    order.disputeStatus =
      req.body.reason || 'pending';

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
