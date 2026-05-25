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
(
order.status === 'waiting_verification' ||
order.status === 'waiting_payment_verification'
) &&
!order.paymentProof
? `

<div class="payment-box">

<h4 class="payment-title">
Data Penerima
</h4>

<input
id="receiver-name-${order._id}"
type="text"
placeholder="Nama Penerima"
/>

<textarea
id="receiver-address-${order._id}"
placeholder="Detail Alamat Lengkap"
></textarea>

<input
id="receiver-phone-${order._id}"
type="text"
placeholder="No Telpon Penerima"
/>

<h4 class="payment-title">
Bank Transfer
</h4>

<select
id="admin-bank-${order._id}"
onchange="handlePaymentMethodChange('${order._id}','bank')"
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

<h4 class="payment-title">
E-Wallet
</h4>

<select
id="admin-ewallet-${order._id}"
onchange="handlePaymentMethodChange('${order._id}','ewallet')"
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
/>

<input
id="sender-name-${order._id}"
type="text"
placeholder="Atas Nama Pengirim"
/>

<label
for="payment-proof-${order._id}"
class="payment-upload-label"
>
📷 Upload Bukti Transfer
</label>

<input
id="payment-proof-${order._id}"
type="file"
accept="image/*"
onchange="previewPaymentFile('${order._id}')"
/>

<div
id="payment-file-name-${order._id}"
style="
font-size:13px;
color:#2563eb;
margin-top:6px;
"
></div>

<button
onclick="submitPaymentProof('${order._id}')"
class="payment-submit-btn"
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

window.handlePaymentMethodChange =
function(orderId,type){

const bankSelect =
document.getElementById(
`admin-bank-${orderId}`
);

const ewalletSelect =
document.getElementById(
`admin-ewallet-${orderId}`
);

if(type === 'bank'){

if(bankSelect.value){
ewalletSelect.value='';
ewalletSelect.disabled=true;
}else{
ewalletSelect.disabled=false;
}

}

if(type === 'ewallet'){

if(ewalletSelect.value){
bankSelect.value='';
bankSelect.disabled=true;
}else{
bankSelect.disabled=false;
}

}

};

window.previewPaymentFile =
function(orderId){

const input =
document.getElementById(
`payment-proof-${orderId}`
);

const label =
document.getElementById(
`payment-file-name-${orderId}`
);

if(
input.files &&
input.files[0]
){
label.innerHTML =
`File dipilih: ${input.files[0].name}`;
}

};

async function submitPaymentProof(orderId){

try{

const existingOrders =
await fetchMyOrders();

const existingOrder =
existingOrders.find(
item =>
item._id === orderId
);

if(existingOrder?.paymentProof){

alert(
'Pembayaran sudah pernah dikirim'
);
return;

}

const receiverName =
document.getElementById(
`receiver-name-${orderId}`
)?.value || '';

const receiverAddress =
document.getElementById(
`receiver-address-${orderId}`
)?.value || '';

const receiverPhone =
document.getElementById(
`receiver-phone-${orderId}`
)?.value || '';

const adminBank =
document.getElementById(
`admin-bank-${orderId}`
)?.value || '';

const adminEwallet =
document.getElementById(
`admin-ewallet-${orderId}`
)?.value || '';

const senderBank =
document.getElementById(
`sender-bank-${orderId}`
)?.value || '';

const senderName =
document.getElementById(
`sender-name-${orderId}`
)?.value || '';

const selectedPaymentMethod =
adminBank || adminEwallet;

if(!selectedPaymentMethod){
alert(
'Pilih metode pembayaran dulu'
);
return;
}

await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/orders/${orderId}/payment`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${localStorage.getItem('token')}`
},
body:JSON.stringify({

receiverName,
receiverAddress,
receiverPhone,

senderBank,
senderName,

adminPaymentMethod:
selectedPaymentMethod,

paymentStatus:
'waiting_verification',

status:
'waiting_confirmation'

})
}
);

alert(
'Pembayaran berhasil dikirim, menunggu konfirmasi admin'
);

loadOrders();

}catch(error){

console.log(error);

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
