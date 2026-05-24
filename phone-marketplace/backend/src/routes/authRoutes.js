const express =
require('express');

const router =
express.Router();

const {
register,
login,
changePassword,

/* PATCH */
addAddress,
deleteAddress,
setDefaultAddress
/* PATCH */

} = require(
'../controllers/authController'
);

const {
protect
} = require(
'../middleware/authMiddleware'
);

router.post(
'/register',
register
);

router.post(
'/login',
login
);

router.put(
'/change-password',
protect,
changePassword
);

/* PATCH START */

router.post(
'/address',
protect,
addAddress
);

router.delete(
'/address/:id',
protect,
deleteAddress
);

router.patch(
'/address/default/:id',
protect,
setDefaultAddress
);

/* PATCH END */

module.exports =
router;
