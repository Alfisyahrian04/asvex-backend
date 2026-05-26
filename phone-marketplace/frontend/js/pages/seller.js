const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!currentUser
){
window.location.href =
'login.html';
}

if(
currentUser.role !==
'seller'
){
window.location.href =
'index.html';
}

const sellerUsername =
document.getElementById(
'seller-username'
);

if(sellerUsername){
sellerUsername.innerText =
currentUser.username;
}

const token =
localStorage.getItem(
'token'
);

let sellerOrders = [];
let selectedRefundOrderId = null;


/* STATUS LABEL */

function getStatusLabel(order){

if(order.status === 'waiting_confirmation'){
return 'Menunggu Konfirmasi Pembayaran';
}

if(order.paymentStatus === 'waiting_verification'){
return 'Menunggu Konfirmasi Pembayaran';
}

if(order.refundStatus === 'requested'){
return 'Buyer Mengajukan Refund';
}

if(order.refundStatus === 'approved'){
return 'Menunggu Barang Retur Buyer';
}

if(order.refundStatus === 'returned'){
return 'Paket Retur Sudah Sampai';
}

if(order.refundStatus === 'waiting_admin_refund'){
return 'Menunggu Refund Admin';
}

if(
order.paymentStatus === 'paid' &&
(
order.status === 'paid' ||
order.status === 'pending' ||
order.status === 'pending_payment'
)
){
return 'Menunggu Diproses';
}

if(order.status === 'processed'){
return 'Sedang Diproses';
}

if(order.status === 'shipped'){
return 'Sedang Dikirim';
}

if(order.status === 'completed'){
return 'Pesanan Selesai';
}

if(order.status === 'cancelled'){
return 'Pesanan Dibatalkan';
}

return order.status || 'Pending';

}


/* LOAD SELLER ORDERS */

async function loadSellerOrders(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller-orders`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const orders =
await response.json();

sellerOrders = orders;

const pendingOrders =
document.getElementById(
'pending-orders'
);

if(!pendingOrders){
return;
}
  if(!orders.length){

pendingOrders.innerHTML =
`
<div class="empty-state">
Belum ada pesanan
</div>
`;

return;

}

pendingOrders.innerHTML =
orders.map(order=>{

const canProcess =
order.paymentStatus === 'paid'
&& order.status !== 'processed'
&& order.status !== 'shipped'
&& order.status !== 'completed';

let buttonHtml = '';

if(canProcess){

buttonHtml =
`
<button
onclick="processOrder('${order._id}')"
class="password-btn"
style="margin-top:12px;height:45px;"
>
Proses Pesanan
</button>
`;

}

else if(
order.paymentStatus === 'waiting_verification'
||
order.status === 'pending_payment'
||
order.status === 'waiting_confirmation'
){

buttonHtml =
`
<button
disabled
class="password-btn"
style="
margin-top:12px;
height:45px;
opacity:.6;
cursor:not-allowed;
"
>
Menunggu Pembayaran
</button>
`;

}

if(
order.status === 'processed'
){

buttonHtml = `
<div style="
margin-top:12px;
display:flex;
flex-direction:column;
gap:12px;
">

<input
id="resi-${order._id}"
placeholder="Input nomor resi"
style="
height:48px;
padding:12px;
border-radius:14px;
border:1px solid #e5e7eb;
"
/>

<label
for="foto-${order._id}"
style="
padding:14px;
border-radius:14px;
border:2px dashed #ff6b00;
background:#fff7ed;
text-align:center;
font-weight:600;
color:#ff6b00;
cursor:pointer;
"
>
📦 Upload Foto Paket
</label>

<input
type="file"
accept="image/*"
id="foto-${order._id}"
style="display:none"
onchange="previewShippingPhoto('${order._id}')"
/>

<div
id="upload-status-${order._id}"
style="
font-size:13px;
font-weight:600;
"
></div>

<img
id="preview-${order._id}"
style="
display:none;
width:100%;
border-radius:12px;
"
/>

<button
onclick="shipOrder('${order._id}')"
class="password-btn"
style="height:48px;"
>
Paket Sudah Dikirim
</button>

</div>
`;
}


/* REFUND CARD PATCH */

if(
order.refundRequest === true &&
order.refundStatus === 'requested'
){

buttonHtml += `
<div style="
margin-top:16px;
padding:16px;
border-radius:16px;
background:#fff7ed;
">

<h4>Pengajuan Refund Buyer</h4>

<p>
Status:
<b style="color:#ea580c;">
Buyer Mengajukan Refund
</b>
</p>

<p>
Alasan:
${order.refundReason || '-'}
</p>

<button
onclick="openRefundDetailModal('${order._id}')"
class="password-btn"
style="
margin-top:12px;
height:48px;
background:#f97316;
"
>
Lihat Detail Refund
</button>

</div>
`;
}
  if(
order.refundStatus === 'returned'
){

buttonHtml += `
<button
onclick="confirmReturnReceived('${order._id}')"
class="password-btn"
style="
margin-top:14px;
height:48px;
background:#2563eb;
"
>
Paket Retur Sudah Diterima
</button>
`;
}

return `

<div class="product-card">

<img
src="${
order.product?.images?.[0] ||
'https://via.placeholder.com/300'
}"
>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Kategori:
${order.product?.category || '-'}
</p>

<p>
Berat:
${order.product?.weight || '-'} gram
</p>

<p>
Qty:
${order.quantity || 1}
</p>

<p>
Variant:
${order.variant?.color || '-'}
${order.variant?.storage ? ` / ${order.variant.storage}` : ''}
</p>

<p>
Rp ${
Number(
order.totalPrice || 0
).toLocaleString('id-ID')
}
</p>

<p>
Status:
${getStatusLabel(order)}
</p>

<hr
style="
margin:12px 0;
border:none;
border-top:1px solid #eee;
"
/>

<p>
Penerima:
${order.receiverName || '-'}
</p>

<p>
No Telp:
${order.receiverPhone || '-'}
</p>

<p>
Alamat:
${order.receiverAddress || '-'}
</p>

<p>
Metode Transfer:
${order.adminPaymentMethod || '-'}
</p>

<p>
Bank Pengirim:
${order.senderBank || '-'}
</p>

<p>
Atas Nama:
${order.senderName || '-'}
</p>

${
order.status === 'shipped'
&& order.trackingNumber
? `
<p>
No Resi:
${order.trackingNumber}
</p>
`
: ''
}

${
order.status === 'shipped'
&& order.shippingPhoto
? `
<img
src="${order.shippingPhoto}"
style="
margin-top:10px;
border-radius:12px;
width:100%;
"
/>
`
: ''
}

${buttonHtml}

</div>

`;

}).join('');

}catch(error){

console.log(error);

}

}
/* PROCESS ORDER */

async function processOrder(orderId){

try{

const response =
await fetch(
`${BASE_URL}/orders/${orderId}/status`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:
`Bearer ${token}`
},
body:JSON.stringify({
status:'processed'
})
}
);

const data =
await response.json();

if(!response.ok){
alert(
data.message ||
'Gagal update status'
);
return;
}

alert(
'Pesanan diproses'
);

loadSellerOrders();

}catch(error){

console.log(error);

alert(
'Server error'
);

}

}


/* PREVIEW SHIPPING PHOTO */

function previewShippingPhoto(orderId){

const input =
document.getElementById(
`foto-${orderId}`
);

const preview =
document.getElementById(
`preview-${orderId}`
);

const status =
document.getElementById(
`upload-status-${orderId}`
);

const file =
input.files[0];

if(!file){

status.innerHTML =
'❌ Upload gagal';

status.style.color =
'#ef4444';

return;

}

preview.src =
URL.createObjectURL(file);

preview.style.display =
'block';

status.innerHTML =
'✅ Upload berhasil';

status.style.color =
'#16a34a';

}


/* SHIP ORDER */

async function shipOrder(orderId){

try{

const trackingNumber =
document.getElementById(
`resi-${orderId}`
)?.value || '';

const photoInput =
document.getElementById(
`foto-${orderId}`
);

let shippingPhoto = '';

if(
photoInput &&
photoInput.files &&
photoInput.files[0]
){

const file =
photoInput.files[0];

shippingPhoto =
await new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
()=>resolve(reader.result);

reader.onerror =
reject;

reader.readAsDataURL(file);

});
}
  await fetch(
`${BASE_URL}/seller/shipping/${orderId}`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:
`Bearer ${token}`
},
body:JSON.stringify({
trackingNumber,
shippingPhoto
})
}
);

alert(
'Paket berhasil dikirim'
);

loadSellerOrders();

}catch(error){

alert(
'Server error'
);

}

}


/* REFUND MODAL ACTION */

window.openRefundDetailModal =
function(orderId){

const order =
sellerOrders.find(
item =>
item._id === orderId
);

if(!order) return;

selectedRefundOrderId =
orderId;

document.getElementById(
'refund-detail-reason'
).innerText =
'Alasan: ' +
(order.refundReason || '-');

const video =
document.getElementById(
'refund-detail-video'
);

if(
order.unboxingVideo
){
video.src =
order.unboxingVideo;
video.style.display =
'block';
}else{
video.style.display =
'none';
}

document.getElementById(
'refund-detail-modal'
).style.display =
'block';

document.getElementById(
'approve-refund-btn'
).onclick =
async function(){
await approveRefund(
selectedRefundOrderId
);
};

};

window.closeRefundDetailModal =
function(){

document.getElementById(
'refund-detail-modal'
).style.display =
'none';

};


/* REFUND ACTION */

async function approveRefund(orderId){

try{

const returnAddress =
document.getElementById(
'seller-return-address'
).value;

if(!returnAddress){
alert(
'Alamat retur wajib diisi'
);
return;
}

await fetch(
`${BASE_URL}/seller/refund/${orderId}/approve`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:
`Bearer ${token}`
},
body:JSON.stringify({
returnAddress
})
}
);

alert(
'Refund disetujui'
);

closeRefundDetailModal();

loadSellerOrders();

}catch(error){

alert(
'Gagal approve refund'
);

}

}

async function confirmReturnReceived(orderId){

await fetch(
`${BASE_URL}/seller/refund/${orderId}/received`,
{
method:'PUT',
headers:{
Authorization:
`Bearer ${token}`
}
}
);

alert(
'Paket retur diterima'
);

loadSellerOrders();

}


/* LOAD STATS */

async function loadSellerStats(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller/stats`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const sellerBalance =
document.getElementById(
'seller-balance'
);

const monthlyIncome =
document.getElementById(
'monthly-income'
);

const totalOrders =
document.getElementById(
'total-orders'
);

if(sellerBalance){

sellerBalance.innerText =
`RP ${Number(
data.balance || 0
).toLocaleString('id-ID')}`;

}

if(monthlyIncome){

monthlyIncome.innerText =
`RP ${Number(
data.monthlyRevenue || 0
).toLocaleString('id-ID')}`;

}

if(totalOrders){

totalOrders.innerText =
`${data.totalOrders || 0} UNIT`;

}

}catch(error){

console.log(error);

}

}

window.processOrder =
processOrder;

window.shipOrder =
shipOrder;

window.previewShippingPhoto =
previewShippingPhoto;

window.approveRefund =
approveRefund;

window.confirmReturnReceived =
confirmReturnReceived;

loadSellerOrders();

loadSellerStats();
