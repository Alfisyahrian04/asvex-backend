const midtransClient =
require('midtrans-client');

const snap =
new midtransClient.Snap({

isProduction:false,

serverKey:
process.env.MIDTRANS_SERVER_KEY,

clientKey:
process.env.MIDTRANS_CLIENT_KEY

});

exports.createPayment =
async(order)=>{

const parameter = {

transaction_details:{

order_id:
order._id.toString(),

gross_amount:
order.totalPrice

},

customer_details:{

first_name:
order.buyer.toString()

}

};

const transaction =
await snap.createTransaction(
parameter
);

return {

token:
transaction.token,

redirect_url:
transaction.redirect_url

};

};
