const Order =
require('../models/Order');

exports.getMarketplaceAnalytics =
async()=>{

const totalOrders =
await Order.countDocuments();

const totalRevenueData =
await Order.find({
paymentStatus:'paid'
});

const revenue =
totalRevenueData.reduce(
(total,item)=>
total + item.totalPrice,
0
);

return {
totalOrders,
revenue
};

};
