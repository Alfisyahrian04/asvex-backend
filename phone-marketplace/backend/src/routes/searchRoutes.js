const router =
require('express').Router();

const controller =
require('../controllers/searchController');

router.get(
  '/',
  controller.searchProducts
);

module.exports = router;
