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

${getStatusLabel(
order.status || 'pending_payment'
)}

</div>

<div class="tracking-number">

Order ID:
${order._id}

</div>

<div class="delivery-status">

${new Date(
order.createdAt
).toLocaleDateString(
'id-ID'
)}

</div>

${
order.paymentMethod
? `
<div class="delivery-status">
Metode:
${order.paymentMethod}
</div>
`
: ''
}

${
order.paymentProof
? `
<a
href="${order.paymentProof}"
target="_blank"
class="btn-primary"
style="
display:inline-flex;
margin-top:10px;
padding:10px 14px;
font-size:14px;
text-decoration:none;
"
>
Lihat Bukti Bayar
</a>
`
: ''
}

</div>

</div>

`).join('');

}

/* SOCKET REALTIME */

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
