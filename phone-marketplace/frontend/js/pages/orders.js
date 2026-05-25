protectPage();

const ordersContainer =
document.getElementById(
'orders-container'
);

async function loadOrders(){

try{

const orders =
await fetchMyOrders();

renderOrders(
orders
);

}catch(error){

ordersContainer.innerHTML = `

<div class="empty-product">

Gagal memuat transaksi

</div>

`;

}

}

function getStatusLabel(status){

switch(status){

case 'pending_payment':
return 'Menunggu Pembayaran';

case 'waiting_confirmation':
return 'Menunggu Konfirmasi Admin';

case 'waiting_verification':
return 'Menunggu Verifikasi Pembayaran';

case 'waiting_payment_verification':
return 'Menunggu Verifikasi Pembayaran';

case 'payment_verified':
return 'Pembayaran Diterima';

case 'paid':
return 'Pembayaran Diterima';

case 'processed':
return 'Sedang Diproses';

case 'shipped':
return 'Pesanan Dikirim';

case 'completed':
return 'Pesanan Selesai';

case 'cancelled':
return 'Pesanan Dibatalkan';

default:
return status;

}

}

function renderOrders(orders){

if(!orders.length){

ordersContainer.innerHTML = `

<div class="empty-product">

Belum ada transaksi

</div>

`;

return;

}

ordersContainer.innerHTML =
orders.map(order=>`

<div class="order-card">

<img
src="${
order.product?.images?.[0]
||
'https://via.placeholder.com/300'
}"
class="order-image"
/>

<div class="order-info">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</p>

<div class="order-status">
${getStatusLabel(order.status || 'pending_payment')}
</div>

<div class="tracking-number">
Order ID:
${order._id}
</div>

${
order.trackingNumber
? `
<div class="tracking-number">
Resi:
${order.trackingNumber}
</div>
`
: ''
}

${
order.status === 'waiting_verification'
||
order.status === 'waiting_payment_verification'
? `

<div
style="
margin-top:16px;
padding:16px;
background:#f8fafc;
border-radius:14px;
"
>

<h4 style="margin-bottom:10px;">
Transfer Pembayaran
</h4>

<p>BCA - AL GADGET</p>
<p>1234567890</p>

<p>Mandiri - AL GADGET</p>
<p>9876543210</p>

<input
id="sender-bank-${order._id}"
type="text"
placeholder="Bank Pengirim"
style="
width:100%;
margin-top:10px;
padding:12px;
border-radius:10px;
border:1px solid #ddd;
"
/>

<input
id="sender-name-${order._id}"
type="text"
placeholder="Atas Nama Pengirim"
style="
width:100%;
margin-top:10px;
padding:12px;
border-radius:10px;
border:1px solid #ddd;
"
/>

<input
id="payment-proof-${order._id}"
type="file"
accept="image/*"
style="
width:100%;
margin-top:10px;
"
/>

<button
onclick="submitPaymentProof('${order._id}')"
class="btn-primary"
style="margin-top:12px;"
>
Konfirmasi Pembayaran
</button>

</div>

`
: ''
}

${
order.status === 'shipped'
? `
<button
onclick="handleCompleteOrder('${order._id}')"
class="btn-primary"
style="margin-top:14px;"
>
Pesanan Selesai
</button>
`
: ''
}

</div>
</div>

`).join('');

}

async function submitPaymentProof(orderId){

try{

alert(
'Bukti pembayaran berhasil dikirim, menunggu verifikasi admin'
);

loadOrders();

}catch(error){

alert(
'Gagal upload bukti pembayaran'
);

}

}

async function handleCompleteOrder(id){

try{

await completeOrder(id);

loadOrders();

}catch(error){

alert(
'Gagal update pesanan'
);

}

}

if(
typeof socket !== 'undefined'
){

socket.on(
'order-updated',
()=>{
loadOrders();
}
);

}

loadOrders();
