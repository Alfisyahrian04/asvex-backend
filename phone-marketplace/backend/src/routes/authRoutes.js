const express =
require('express');

const router =
express.Router();

const {
register,
login,
changePassword
} = require(
'../controllers/authController'
);

const authMiddleware =
require(
'../middlewares/authMiddleware'
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
authMiddleware,
changePassword
);

module.exports =
router;
