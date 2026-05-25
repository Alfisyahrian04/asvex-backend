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

<div
style="
font-size:14px;
color:#6b7280;
margin-top:8px;
line-height:1.8;
"
>

<div>
Kategori:
<b>${order.product?.category || '-'}</b>
</div>

<div>
Berat:
<b>${order.product?.weight || '-'} gram</b>
</div>

<div>
Qty:
<b>${order.quantity || 1}</b>
</div>

<div>
Variant:
<b>
${order.variant?.color || '-'}
${order.variant?.storage ? ` / ${order.variant.storage}` : ''}
</b>
</div>

</div>

<p
style="
margin-top:12px;
font-size:18px;
font-weight:700;
"
>
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
margin-top:18px;
padding:18px;
background:#f8fafc;
border-radius:18px;
border:1px solid #edf2f7;
"
>

<h4
style="
font-size:18px;
font-weight:700;
margin-bottom:14px;
"
>
Data Penerima
</h4>

<input
id="receiver-name-${order._id}"
type="text"
placeholder="Nama Penerima"
style="
width:100%;
padding:14px;
margin-bottom:12px;
border-radius:12px;
border:1px solid #ddd;
box-sizing:border-box;
"
/>

<textarea
id="receiver-address-${order._id}"
placeholder="Detail Alamat Lengkap"
style="
width:100%;
padding:14px;
margin-bottom:12px;
border-radius:12px;
border:1px solid #ddd;
min-height:90px;
box-sizing:border-box;
resize:none;
"
></textarea>

<input
id="receiver-phone-${order._id}"
type="text"
placeholder="No Telpon Penerima"
style="
width:100%;
padding:14px;
margin-bottom:16px;
border-radius:12px;
border:1px solid #ddd;
box-sizing:border-box;
"
/>

<h4
style="
font-size:18px;
font-weight:700;
margin-bottom:10px;
"
>
Bank Transfer
</h4>

<select
id="admin-bank-${order._id}"
style="
width:100%;
padding:14px;
border-radius:12px;
border:1px solid #ddd;
margin-bottom:16px;
"
>

<option value="">
Pilih Rekening Admin
</option>

<option>
BCA - AL GADGET - 1234567890
</option>

<option>
Mandiri - AL GADGET - 9876543210
</option>

<option>
BNI - AL GADGET - 4567891230
</option>

<option>
BRI - AL GADGET - 3216549870
</option>

<option>
JAGO - AL GADGET - 1122334455
</option>

</select>

<h4
style="
font-size:18px;
font-weight:700;
margin-bottom:10px;
"
>
E-Wallet
</h4>

<select
id="admin-ewallet-${order._id}"
style="
width:100%;
padding:14px;
border-radius:12px;
border:1px solid #ddd;
margin-bottom:16px;
"
>

<option value="">
Pilih E-Wallet Admin
</option>

<option>
GoPay - 081234567890
</option>

<option>
DANA - 081234567891
</option>

<option>
OVO - 081234567892
</option>

<option>
ShopeePay - 081234567893
</option>

</select>

<input
id="sender-bank-${order._id}"
type="text"
placeholder="Bank Pengirim"
style="
width:100%;
padding:14px;
margin-bottom:12px;
border-radius:12px;
border:1px solid #ddd;
box-sizing:border-box;
"
/>

<input
id="sender-name-${order._id}"
type="text"
placeholder="Atas Nama Pengirim"
style="
width:100%;
padding:14px;
margin-bottom:12px;
border-radius:12px;
border:1px solid #ddd;
box-sizing:border-box;
"
/>

<input
id="payment-proof-${order._id}"
type="file"
accept="image/*"
style="
width:100%;
margin-bottom:14px;
"
/>

<button
onclick="submitPaymentProof('${order._id}')"
class="btn-primary"
style="
width:100%;
margin-top:8px;
"
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
