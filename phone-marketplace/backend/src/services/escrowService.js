const Wallet =
require('../models/Wallet');

const WalletTransaction =
require('../models/WalletTransaction');

exports.releaseEscrow =
async(order)=>{

let wallet =
await Wallet.findOne({

user:order.seller

});

if(!wallet){

wallet =
await Wallet.create({

user:order.seller

});

}

wallet.balance +=
order.totalPrice;

await wallet.save();

await WalletTransaction.create({

user:order.seller,

type:'income',

amount:order.totalPrice,

description:
'Order completed'

});

};
