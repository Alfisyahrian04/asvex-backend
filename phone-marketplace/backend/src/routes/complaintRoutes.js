const express =
require('express');

const router =
express.Router();

const {
createComplaint,
createTicket,
getComplaints,
updateComplaintStatus
} = require(
'../controllers/complaintController'
);

const {
protect,
roleMiddleware
} = require(
'../middleware/authMiddleware'
);

router.post(
'/',
protect,
createComplaint
);

router.post(
'/ticket',
protect,
createTicket
);

router.get(
'/',
protect,
roleMiddleware(
'admin',
'customer_service'
),
getComplaints
);

router.put(
'/:id',
protect,
roleMiddleware(
'admin',
'customer_service'
),
updateComplaintStatus
);

/* PATCH START */

router.put(
'/:id/resolve',
protect,
roleMiddleware(
'admin'
),
updateComplaintStatus
);

/* PATCH END */

module.exports =
router;
