const checkoutModal =
document.getElementById(
'checkout-modal'
);

const checkoutItems =
document.getElementById(
'checkout-items'
);

const checkoutTotal =
document.getElementById(
'checkout-total'
);

const checkoutButton =
document.getElementById(
'checkout-btn'
);

const paymentProofInput =
document.getElementById(
'payment-proof'
);

const paymentMethodInput =
document.getElementById(
'payment-method'
);

const shippingCourierInput =
document.getElementById(
'shipping-courier'
);

const shippingAddressInput =
document.getElementById(
'shipping-address'
);

function openCheckoutModal(){

const cart =
cartStore.getCart();

if(!cart.length){

alert(
'Keranjang kosong'
);

return;

}

checkoutModal.style.display =
'flex';

renderCheckoutItems();

}

function closeCheckoutModal(){

checkoutModal.style.display =
'none';

}

function renderCheckoutItems(){

const cart =
cartStore.getCart();

checkoutItems.innerHTML =
cart.map(item=>`

<div class="checkout-item">

<img
src="${
item.images?.[0]
||
'https://via.placeholder.com/300'
}"
>

<div>

<h3>${item.name}</h3>

<p>
${item.quantity || 1} x
Rp ${Number(item.price).toLocaleString('id-ID')}
</p>

</div>

</div>

`).join('');

checkoutTotal.innerText =
`Rp ${cartStore.getCartTotal().toLocaleString('id-ID')}`;

}

async function checkoutOrder(){

try{

const cart =
cartStore.getCart();

if(!cart.length){
alert('Keranjang kosong');
return;
}

const paymentMethod =
paymentMethodInput?.value || 'Transfer Bank';

const shippingCourier =
shippingCourierInput?.value || 'J&T Express';

const shippingAddress =
shippingAddressInput?.value || '';

if(!shippingAddress.trim()){
alert('Alamat pengiriman wajib diisi');
return;
}

const paymentFile =
paymentProofInput?.files?.[0];

if(!paymentFile){
alert('Upload bukti pembayaran');
return;
}

checkoutButton.disabled = true;
checkoutButton.innerText = 'Memproses...';

const reader = new FileReader();

reader.onload =
async function(e){

try{

const paymentProof =
e.target.result;

for(const item of cart){

const payload = {

productId:item._id,

quantity:item.quantity || 1,

shippingAddress,

shippingCourier,

shippingCost:15000,

paymentMethod,

paymentProof,

variant:
item.variant?._id ||
item.variant ||
null,

totalPrice:
(item.price * (item.quantity || 1)) + 15000,

status:
'waiting_payment_verification',

paymentStatus:
'waiting_verification'

};

await createOrder(payload);

}

cartStore.clearCart();

alert(
'Pesanan berhasil dibuat'
);

window.location.href =
'orders.html';

}catch(error){

console.error(
'CHECKOUT ERROR:',
error
);

alert(
error.message ||
'Checkout gagal'
);

checkoutButton.disabled = false;
checkoutButton.innerText = 'Bayar Sekarang';

}

};

reader.onerror = function(){

alert('Gagal membaca bukti pembayaran');

checkoutButton.disabled = false;
checkoutButton.innerText = 'Bayar Sekarang';

};

reader.readAsDataURL(
paymentFile
);

}catch(error){

console.error(error);

alert(
error.message ||
'Checkout gagal'
);

checkoutButton.disabled = false;
checkoutButton.innerText = 'Bayar Sekarang';

}

}

window.openCheckoutModal =
openCheckoutModal;

window.closeCheckoutModal =
closeCheckoutModal;

window.checkoutOrder =
checkoutOrder;
