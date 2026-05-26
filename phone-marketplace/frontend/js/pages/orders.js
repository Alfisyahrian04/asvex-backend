const API_URL =
  window.API_URL ||
  'https://asvex-backend-production.up.railway.app/api';

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

case 'waiting_seller_approval':
return 'Menunggu Persetujuan Seller';

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
order.product?.images?.[0] ||
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
order.status === 'pending_payment'
? `
<div class="payment-box">

<h4 class="payment-title">Data Penerima</h4>

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

<h4 class="payment-title">Bank Transfer</h4>

<select
id="admin-bank-${order._id}"
onchange="handlePaymentMethodChange('${order._id}','bank')"
>
<option value="">Pilih Rekening Admin</option>
<option>BCA - AL GADGET - 1234567890</option>
<option>Mandiri - AL GADGET - 9876543210</option>
<option>BNI - AL GADGET - 4567891230</option>
<option>BRI - AL GADGET - 3216549870</option>
</select>

<h4 class="payment-title">E-Wallet</h4>

<select
id="admin-ewallet-${order._id}"
onchange="handlePaymentMethodChange('${order._id}','ewallet')"
>
<option value="">Pilih E-Wallet Admin</option>
<option>GoPay - 081234567890</option>
<option>DANA - 081234567891</option>
<option>OVO - 081234567892</option>
<option>ShopeePay - 081234567893</option>
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
style="
margin-top:16px;
width:100%;
height:56px;
border:none;
border-radius:18px;
font-size:17px;
font-weight:700;
color:#fff;
background:linear-gradient(135deg,#22c55e,#16a34a);
box-shadow:0 12px 24px rgba(34,197,94,.25);
cursor:pointer;
"
>
✓ Pesanan Selesai
</button>

<button
onclick="openRefundModal('${order._id}')"
style="
margin-top:12px;
width:100%;
height:52px;
border:none;
border-radius:16px;
font-size:16px;
font-weight:700;
color:white;
background:#ef4444;
cursor:pointer;
"
>
Ajukan Refund
</button>
`
: ''
}

</div>
</div>

<div
id="refund-modal-${order._id}"
style="
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.5);
z-index:9999;
padding:20px;
overflow:auto;
"
>

<div
style="
background:#fff;
margin:40px auto;
max-width:500px;
border-radius:20px;
padding:20px;
"
>

<h3>Ajukan Refund</h3>

<textarea
id="refund-reason-${order._id}"
placeholder="Tulis alasan refund..."
style="
width:100%;
min-height:100px;
padding:12px;
margin-top:14px;
border-radius:12px;
"
></textarea>

<input
id="refund-bank-${order._id}"
placeholder="Nama Bank"
style="width:100%;margin-top:12px;padding:12px;"
/>

<input
id="refund-name-${order._id}"
placeholder="Atas Nama Rekening"
style="width:100%;margin-top:12px;padding:12px;"
/>

<input
id="refund-number-${order._id}"
placeholder="Nomor Rekening Refund"
style="width:100%;margin-top:12px;padding:12px;"
/>

<label
for="refund-video-${order._id}"
style="
display:block;
margin-top:14px;
padding:14px;
border:2px dashed #fb923c;
border-radius:14px;
text-align:center;
cursor:pointer;
"
>
🎥 Upload Video Unboxing (Wajib)
</label>

<input
type="file"
accept="video/*"
id="refund-video-${order._id}"
style="display:none"
onchange="previewRefundVideo('${order._id}')"
/>

<div
id="refund-video-name-${order._id}"
style="
font-size:13px;
margin-top:8px;
color:#2563eb;
"
></div>

<p
style="
font-size:12px;
color:#dc2626;
margin-top:12px;
"
>
Kesalahan pengisian rekening refund bukan tanggung jawab platform.
</p>

<button
onclick="submitRefund('${order._id}')"
class="payment-submit-btn"
style="margin-top:12px;background:#ef4444;"
>
Kirim Refund
</button>

<button
onclick="closeRefundModal('${order._id}')"
style="
margin-top:10px;
width:100%;
height:48px;
border:none;
border-radius:14px;
"
>
Tutup
</button>

</div>
</div>

`).join('');

}

window.openRefundModal = function(id){
document.getElementById(
`refund-modal-${id}`
).style.display='block';
};

window.closeRefundModal = function(id){
document.getElementById(
`refund-modal-${id}`
).style.display='none';
};

window.handlePaymentMethodChange =
function(orderId,type){

const bank =
document.getElementById(
`admin-bank-${orderId}`
);

const ewallet =
document.getElementById(
`admin-ewallet-${orderId}`
);

if(type === 'bank'){
if(bank.value){
ewallet.value='';
ewallet.disabled=true;
}else{
ewallet.disabled=false;
}
}

if(type === 'ewallet'){
if(ewallet.value){
bank.value='';
bank.disabled=true;
}else{
bank.disabled=false;
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

if(input.files && input.files[0]){
label.innerHTML =
`File dipilih: ${input.files[0].name}`;
}

};

window.previewRefundVideo =
function(orderId){

const input =
document.getElementById(
`refund-video-${orderId}`
);

const label =
document.getElementById(
`refund-video-name-${orderId}`
);

if(input.files && input.files[0]){
label.innerHTML =
`Video dipilih: ${input.files[0].name}`;
}

};

async function submitPaymentProof(orderId){

try{

const receiverName =
document.getElementById(
`receiver-name-${orderId}`
).value;

const receiverAddress =
document.getElementById(
`receiver-address-${orderId}`
).value;

const receiverPhone =
document.getElementById(
`receiver-phone-${orderId}`
).value;

const adminBank =
document.getElementById(
`admin-bank-${orderId}`
).value;

const adminEwallet =
document.getElementById(
`admin-ewallet-${orderId}`
).value;

const senderBank =
document.getElementById(
`sender-bank-${orderId}`
).value;

const senderName =
document.getElementById(
`sender-name-${orderId}`
).value;

await submitPayment(
orderId,
{
receiverName,
receiverAddress,
receiverPhone,
senderBank,
senderName,
adminPaymentMethod:
adminBank || adminEwallet,
paymentProof:'uploaded'
}
);

alert(
'Pembayaran berhasil dikirim, menunggu konfirmasi admin'
);

loadOrders();

}catch(error){

alert(
'Gagal upload bukti pembayaran'
);

}

}

async function submitRefund(orderId){

try{

const refundReason =
document.getElementById(
`refund-reason-${orderId}`
).value;

const refundBank =
document.getElementById(
`refund-bank-${orderId}`
).value;

const refundName =
document.getElementById(
`refund-name-${orderId}`
).value;

const refundNumber =
document.getElementById(
`refund-number-${orderId}`
).value;

if(!refundReason){
alert('Isi alasan refund dulu');
return;
}

if(!refundBank || !refundName || !refundNumber){
alert('Lengkapi data rekening refund');
return;
}

const videoInput =
document.getElementById(
`refund-video-${orderId}`
);

if(
!videoInput ||
!videoInput.files ||
!videoInput.files[0]
){
alert(
'Wajib kirim video unboxing tanpa di edit'
);
return;
}

const file =
videoInput.files[0];

const unboxingVideo =
await new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
()=>resolve(reader.result);

reader.onerror =
reject;

reader.readAsDataURL(file);

}
);

const response =
await fetch(
`${API_URL}/orders/${orderId}/refund`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:
`Bearer ${localStorage.getItem('token')}`
},
body:JSON.stringify({
refundRequest:true,
refundReason,
refundBank,
refundName,
refundNumber,
unboxingVideo,
status:'waiting_seller_approval',
refundStatus:'waiting_seller_approval'
})
}
);

const data =
await response.json();

if(!response.ok){
alert(
data.message ||
'Gagal ajukan refund'
);
return;
}

alert(
'Refund berhasil diajukan, menunggu persetujuan seller'
);

closeRefundModal(orderId);

loadOrders();

}catch(error){

console.log(error);

alert('Gagal ajukan refund');

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
