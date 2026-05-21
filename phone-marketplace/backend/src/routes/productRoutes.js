const router =
require('express').Router();

const controller =
require('../controllers/productController');

const auth =
require('../middleware/authMiddleware');

router.get(
  '/',
  controller.getProducts
);

router.post(
  '/',
  auth,
  controller.createProduct
);

module.exports = router;
