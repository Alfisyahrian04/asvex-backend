const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(!currentUser){
window.location.href='login.html';
}

if(currentUser.role !== 'seller'){
window.location.href='index.html';
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

if(
  order.refundStatus === 'refund_rejected' ||
  order.status === 'refund_rejected'
){
  return 'Refund Ditolak';
}

if(order.refundStatus === 'appealed'){
  return 'Banding Dikirim';
}
  
if(order.status === 'appeal_submitted'){
  return 'Banding Dikirim';
}
  
if(order.status === 'waiting_confirmation'){
return 'Menunggu Konfirmasi Pembayaran';
}

if(order.paymentStatus === 'waiting_verification'){
return 'Menunggu Konfirmasi Pembayaran';
}

if(
order.refundStatus === 'requested' ||
order.refundStatus === 'waiting_seller_approval'
){
return 'Buyer Mengajukan Refund';
}

if(order.refundStatus === 'approved'){
return 'Menunggu Barang Retur Sampai';
}

if(order.refundStatus === 'returned'){
return 'Paket Retur Sudah Sampai';
}

if(
  order.status === 'waiting_seller_receive_return'
){
  return 'Menunggu Barang Retur Sampai';
}  

if(order.refundStatus === 'waiting_admin_refund' ||
  order.status === 'waiting_admin_refund'
){
  return 'Menunggu Refund';
}

if(
  order.refundStatus === 'refund_completed' ||
  order.status === 'refund_completed'
){
  return 'Proses Refund Berhasil';
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

if(order.status === 'rejected'){
  return 'Transaksi Ditolak';
}
if(order.status === 'completed'){
return 'Pesanan Selesai';
}

if(order.status === 'cancelled'){
return 'Pesanan Dibatalkan';
}

return order.status || 'Pending';

}

function getStatusClass(order){

  const statusLabel = getStatusLabel(order);

  if(
    statusLabel === 'Pesanan Selesai' ||
    statusLabel === 'Proses Refund Berhasil'
  ){
    return 'status-success';
  }

  if(
    statusLabel === 'Pesanan Dibatalkan' ||
    statusLabel === 'Transaksi Ditolak'
  ){
    return 'status-danger';
  }

  return 'status-warning';
}

/* LOAD SELLER ORDERS */

async function loadSellerOrders(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller-orders`,
{
headers:{
Authorization:`Bearer ${token}`
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

if(!pendingOrders) return;

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
&& order.status !== 'completed'
&& order.status !== 'refund_rejected'
&& order.refundStatus !== 'refund_rejected'
&& order.refundRequest !== true;

let buttonHtml = '';

if(canProcess){

buttonHtml = `
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

buttonHtml = `
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


/* REFUND CARD */

if(
order.refundRequest === true &&
(
order.refundStatus === 'requested' ||
order.refundStatus === 'waiting_seller_approval'
)
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
  order.status === 'waiting_seller_receive_return'
){

buttonHtml += `

<div
style="
display:flex;
flex-direction:column;
gap:12px;
margin-top:14px;
"
>

<button
onclick="confirmReturnReceived('${order._id}')"
class="password-btn"
style="
height:48px;
background:#2563eb;
"
>
Terima Paket Retur
</button>

<button
onclick="openSellerAppealModal('${order._id}')"
class="password-btn"
style="
height:48px;
background:#ef4444;
"
>
Ajukan Banding
</button>

</div>

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

<div class="product-card-content">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Rp ${
Number(
order.totalPrice || 0
).toLocaleString('id-ID')
}
</p>

<p>
Status:
<span class="${getStatusClass(order)}">
${getStatusLabel(order)}
</span>
</p>

<div
class="order-detail-toggle"
onclick="toggleOrderDetail('${order._id}')"
>
Lihat Detail Order
</div>
</div>
<div
id="detail-${order._id}"
class="order-detail-box"
>

<p>Kategori: ${order.product?.category || '-'}</p>
<p>Berat: ${order.product?.weight || '-'} gram</p>
<p>Qty: ${order.quantity || 1}</p>
<p>Penerima: ${order.receiverName || '-'}</p>
<p>No Telp: ${order.receiverPhone || '-'}</p>
<p>Alamat: ${order.receiverAddress || '-'}</p>
<p>Metode Transfer: ${order.adminPaymentMethod || '-'}</p>
<p>Bank Pengirim: ${order.senderBank || '-'}</p>
<p>Atas Nama: ${order.senderName || '-'}</p>

${buttonHtml}

</div>
</div>
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
Authorization:`Bearer ${token}`
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
status.innerHTML='❌ Upload gagal';
status.style.color='#ef4444';
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
Authorization:`Bearer ${token}`
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


/* REFUND MODAL */

window.openRefundDetailModal =
function(orderId){

const order =
sellerOrders.find(
item => item._id === orderId
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

if(order.unboxingVideo){
video.src = order.unboxingVideo;
video.style.display = 'block';
}else{
video.style.display = 'none';
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

document.getElementById(
'reject-refund-btn'
).onclick =
async function(){
await rejectRefund(
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


/* APPROVE REFUND */

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
Authorization:`Bearer ${token}`
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


/* REJECT REFUND */

async function rejectRefund(orderId){

try{

const reason =
prompt(
'Alasan reject refund'
);

if(!reason) return;

const bankName =
prompt('Nama bank pencairan');

const accountName =
prompt('Nama pemilik rekening');

const accountNumber =
prompt('Nomor rekening');

await fetch(
`${BASE_URL}/seller/refund/${orderId}/reject`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
  rejectReason: reason,
  bankName,
  accountName,
  accountNumber
})
}
);

alert(
'Refund ditolak'
);

closeRefundDetailModal();

loadSellerOrders();

}catch(error){

alert(
'Gagal reject refund'
);

}

}


/* RETURN RECEIVED */

async function confirmReturnReceived(orderId){

await fetch(
`${BASE_URL}/seller/refund/${orderId}/return-received`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

alert(
'Paket retur diterima'
);

loadSellerOrders();

}


/* TOGGLE DETAIL */

window.toggleOrderDetail =
function(orderId){

const el =
document.getElementById(
`detail-${orderId}`
);

if(!el) return;

el.classList.toggle(
'active'
);

};


/* LOAD STATS */

async function loadSellerStats(){

try{

const response =
await fetch(
`${BASE_URL}/orders/seller/stats`,
{
headers:{
Authorization:`Bearer ${token}`
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


/* EXPORT */

window.processOrder = processOrder;
window.shipOrder = shipOrder;
window.previewShippingPhoto = previewShippingPhoto;
window.approveRefund = approveRefund;
window.rejectRefund = rejectRefund;
window.confirmReturnReceived = confirmReturnReceived;


/* INIT */
window.openSellerAppealModal =
function(orderId){

selectedRefundOrderId =
orderId;

const modal =
document.getElementById(
'seller-appeal-modal'
);

modal.style.display =
'block';

modal.style.pointerEvents =
'auto';

};


async function submitSellerAppeal(
  orderId,
  reason,
  appealPhoto='',
  appealVideo=''
){

  try{

    const response =
    await fetch(
      `${BASE_URL}/seller/refund/${orderId}/appeal`,
      {
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          appealReason:reason,
          appealPhoto,
          appealVideo
        })
      }
    );

    const data =
    await response.json();

    if(!response.ok){
      alert(
        data.message ||
        'Gagal mengirim banding'
      );
      return false;
    }

    alert(
      'Banding berhasil dikirim ke admin'
    );

    await loadSellerOrders();

    return true;

  }catch(error){

    console.log(error);

    alert(
      'Gagal mengirim banding'
    );

    return false;

  }
}

/* CLOSE SELLER APPEAL MODAL */

window.closeSellerAppealModal =
function(){

document.getElementById(
'seller-appeal-modal'
).style.display =
'none';

};


/* SUBMIT SELLER APPEAL FORM */

window.submitSellerAppealForm =
async function(){

const reason =
document.getElementById(
'seller-appeal-reason'
).value;

const photoInput =
document.getElementById(
'seller-appeal-photo'
);

const videoInput =
document.getElementById(
'seller-appeal-video'
);

if(!reason){
alert(
'Alasan banding wajib diisi'
);
return;
}

let appealPhoto = '';
let appealVideo = '';

if(photoInput?.files?.[0]){

appealPhoto =
await new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
()=>resolve(reader.result);

reader.onerror =
reject;

reader.readAsDataURL(
photoInput.files[0]
);

});

}

if(videoInput?.files?.[0]){

appealVideo =
await new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
()=>resolve(reader.result);

reader.onerror =
reject;

reader.readAsDataURL(
videoInput.files[0]
);

});

}
const success =
await submitSellerAppeal(
  selectedRefundOrderId,
  reason,
  appealPhoto,
  appealVideo
);

if(success){
  closeSellerAppealModal();
}

};
loadSellerOrders();
loadSellerStats();
