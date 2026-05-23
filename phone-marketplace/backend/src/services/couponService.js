exports.calculateDiscount =
(coupon,total)=>{

if(
coupon.discountType ===
'percent'
){

return total -
(
total *
coupon.discountValue /
100
);

}

return total -
coupon.discountValue;

};
