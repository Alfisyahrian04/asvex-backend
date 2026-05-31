if (typeof protectPage === 'function') {
  protectPage();
}

if (typeof requireRole === 'function') {
  requireRole('admin');
}

const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const token =
localStorage.getItem('token');

let refundOrders = [];

/* SELLER */

async function loadUsers(){

try{

const response =
await fetch(
`${BASE_URL}/admin/users`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const users =
result.users || result || [];

const sellerList =
document.getElementById(
'seller-list'
);

if(!sellerList) return;

const sellers =
users.filter(
user => user.role === 'seller'
);

if(!sellers.length){

sellerList.innerHTML =
`<div class="empty-state">Belum ada seller</div>`;

return;
}

sellerList.innerHTML =
sellers.map(user=>`

<div class="admin-card">
<h3>${user.username || '-'}</h3>
<p>${user.email || '-'}</p>
<p>
Verified:
${user.isVerifiedSeller ? 'verified' : 'pending'}
</p>

<button
onclick="verifySeller('${user._id}')"
>
Verify
</button>

<button
onclick="banUser('${user._id}')"
style="background:#ef4444;"
>
Ban
</button>

</div>

`).join('');

}catch(error){

console.log(
'LOAD USERS ERROR:',
error
);

}

}



/* PAYMENT */

async function loadPendingPayments(){

try{

const response =
await fetch(
`${BASE_URL}/admin/pending-payments`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const orders =
Array.isArray(result)
? result
: result.orders || [];

const paymentList =
document.getElementById(
'payment-list'
);

if(!paymentList) return;

if(!orders.length){

paymentList.innerHTML =
`<div class="empty-state">Belum ada pembayaran</div>`;

return;
}

paymentList.innerHTML =
orders.map(order=>`

<div class="admin-card">
${
  order.paymentProof
    ? `
      <button
        onclick="showPaymentProof('${order.paymentProof}')"
        style="
          width:100%;
          padding:12px;
          background:#2563eb;
          color:#fff;
          border:none;
          border-radius:10px;
          font-weight:600;
          margin-bottom:12px;
          cursor:pointer;
        "
      >
        Lihat Bukti Transfer
      </button>
    `
    : `
      <div style="
        height:180px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#f3f4f6;
        border-radius:12px;
        margin-bottom:12px;
      ">
        Belum upload bukti transfer
      </div>
    `
}

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p>
Bank Pengirim:
${order.senderBank || '-'}
</p>

<p>
Nama Pengirim:
${order.senderName || '-'}
</p>

<p>
Metode Pembayaran:
${order.adminPaymentMethod || order.paymentMethod || '-'}
</p>

<p>
Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</p>

<button
onclick="approvePayment('${order._id}')"
>
Approve Payment
</button>

<button
onclick="rejectPayment('${order._id}')"
style="
background:#ef4444;
margin-top:10px;
"
>
Reject Payment
</button>

</div>

`).join('');

}catch(error){

console.log(error);

}

}


/* ONGOING ORDERS */

async function loadOngoingOrders(){

try{

const response = await fetch(
`${BASE_URL}/admin/orders`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result = await response.json();

console.log('ALL ADMIN ORDERS:', result);

const orders =
result.orders || [];

const container =
document.getElementById(
'ongoing-orders-list'
);

if(!container) return;

if(!orders.length){

container.innerHTML = `
<div class="empty-state">
Belum ada transaksi berlangsung
</div>
`;

return;
}

container.innerHTML =
orders.map(order=>`

<div class="admin-card">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p>
Status:
${order.status || '-'}
</p>

<p>
Payment:
${order.paymentStatus || '-'}
</p>

<p>
Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</p>

</div>

`).join('');

}catch(error){

console.log(
'LOAD ONGOING ORDERS ERROR:',
error
);

}

}

/* REFUND */

async function loadRefundRequests(){

try{

const response =
await fetch(
`${BASE_URL}/admin/refund-requests`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const result =
await response.json();

const orders =
result.orders || [];

const activeRefunds =
orders.filter(order =>
  !order.refundCompleted &&
  order.refundRequest === true &&
  order.refundStatus !== 'rejected' &&
  order.refundStatus !== 'refund_rejected' &&
  order.status !== 'refund_rejected'
);

const refundHistory =
orders.filter(
order => order.refundCompleted
);

refundOrders = orders;

const refundList =
document.getElementById(
'refund-list'
);

if(!refundList) return;

if(!activeRefunds.length &&
!refundHistory.length
){

refundList.innerHTML =
`
<div class="empty-state">
Belum ada refund request
</div>
`;

return;
}

refundList.innerHTML =
activeRefunds.map(order=>{

  const buyerName =
    order.buyer?.username ||
    order.receiverName ||
    'Buyer tidak ditemukan';

  const sellerName =
    order.seller?.storeName ||
    order.seller?.username ||
    'Seller tidak ditemukan';

  if(order.status === 'appeal_submitted'){
return `

<div class="admin-card">

<h3>${order.product?.name || 'Produk'}</h3>

<p>Buyer:
${buyerName}</p>

<p>Seller:
${sellerName}</p>

<p style="color:#2563eb;font-weight:700;">
Seller Mengajukan Banding
</p>

<p>
Alasan banding:
${order.appealReason || '-'}
</p>

<button
onclick="openAppealDetailModal('${order._id}')"
class="password-btn"
style="
margin-top:12px;
width:100%;
height:46px;
background:#2563eb;
"
>
Lihat Detail Banding
</button>

</div>

`;
}

return `
  
<div class="admin-card">

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p>
Seller:
${order.seller?.storeName || order.seller?.username || '-'}
</p>

<p>
Alasan:
${order.refundReason || '-'}
</p>

<p>Bank: ${order.sellerRefundBankName || '-'}</p>

<p>Atas Nama: ${order.sellerRefundAccountName || '-'}</p>

<p>No Rekening: ${order.sellerRefundAccountNumber || '-'}</p>
${
order.unboxingVideo
? `
<details class="refund-video-dropdown">

  <summary>
    🎥 Lihat Video Unboxing
  </summary>

  <video
    src="${order.unboxingVideo}"
    controls
    preload="metadata"
    class="refund-video"
  ></video>

</details>
`
: ''
}

<label
for="refund-proof-${order._id}"
style="
display:block;
margin-top:14px;
padding:14px;
border-radius:14px;
border:2px dashed #fb923c;
text-align:center;
cursor:pointer;
background:#fff7ed;
"
>
📤 Upload Bukti Transfer Refund (Wajib)
</label>

<input
type="file"
accept="image/*"
id="refund-proof-${order._id}"
style="display:none"
onchange="previewRefundProof('${order._id}')"
/>

<div
id="refund-proof-name-${order._id}"
style="
font-size:13px;
margin-top:8px;
color:#2563eb;
"
></div>

<button
onclick="completeRefund('${order._id}')"
style="
margin-top:14px;
width:100%;
height:48px;
border:none;
border-radius:14px;
background:#16a34a;
color:#fff;
font-weight:700;
cursor:pointer;
"
>
Selesai Refund
</button>

</div>

`;
}).join('') +

`
<h3 style="
margin-top:24px;
margin-bottom:14px;
font-size:18px;
font-weight:700;
">
Riwayat Refund
</h3>
<div
style="
width:100%;
display:flex;
flex-direction:column;
gap:14px;
clear:both;
"
>
${
refundHistory.length
? refundHistory.map(order=>`

<div
class="admin-card"
style="
width:100%;
margin-top:14px;
box-sizing:border-box;
display:block;
clear:both;
margin-left:0;
margin-right:0;
max-width:100%;
"
>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Buyer:
${order.buyer?.username || '-'}
</p>

<p style="margin-top:6px;">
Bank:
${order.refundBankName || '-'}
</p>

<p>
Atas Nama:
${order.refundAccountName || '-'}
</p>

<p>
No Rekening:
${order.refundAccountNumber || '-'}
</p>

<p style="
color:#16a34a;
font-weight:700;
margin-top:8px;
">
Refund selesai
</p>

${order.adminRefundTransferProof
? `
<button onclick="previewTransferProof('${order.adminRefundTransferProof}')"
style="
width:100%;
margin-top:12px;
height:46px;
border:none;
border-radius:14px;
background:#2563eb;
color:#fff;
font-weight:700;
cursor:pointer;
"
>
Lihat Bukti Transfer
</button>
`
: ''
}

</div>

`).join('')
: `
<div class="empty-state">
Belum ada riwayat refund
</div>
`
}
</div>
`;

}catch(error){

console.log(error);

}

}



/* PREVIEW */

window.previewRefundProof =
function(orderId){

const input =
document.getElementById(
`refund-proof-${orderId}`
);

const label =
document.getElementById(
`refund-proof-name-${orderId}`
);

if(
input.files &&
input.files[0]
){
label.innerHTML =
`File dipilih: ${input.files[0].name}`;
}

};



/* COMPLETE REFUND */

async function completeRefund(orderId){

try{

const input =
document.getElementById(
`refund-proof-${orderId}`
);

if(
!input.files ||
!input.files[0]
){
alert(
'Upload bukti transfer refund wajib diisi'
);
return;
}

const file =
input.files[0];

const refundTransferProof =
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
`${BASE_URL}/admin/approve-refund/${orderId}`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
refundTransferProof,
refundCompleted:true
})
}
);

const data =
await response.json();

if(!response.ok){
alert(
data.message ||
'Gagal menyelesaikan refund'
);
return;
}

alert(
'Refund berhasil diselesaikan'
);

await loadRefundRequests();

}catch(error){

console.log(
'COMPLETE REFUND ERROR:',
error
);

alert(
'Terjadi kesalahan saat update refund'
);

}

}



/* ACTION */

async function approvePayment(id){

await fetch(
`${BASE_URL}/admin/verify-payment/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadPendingPayments();

}

async function rejectPayment(id){

const reason = prompt(
'Masukkan alasan penolakan pembayaran:'
);

if(!reason) return;

await fetch(
`${BASE_URL}/admin/orders/${id}/reject`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body: JSON.stringify({
rejectionReason: reason
})
}
);

loadPendingPayments();

}

loadPendingPayments();

async function verifySeller(id){

await fetch(
`${BASE_URL}/admin/verify-seller/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadUsers();

}

async function banUser(id){

await fetch(
`${BASE_URL}/admin/ban-user/${id}`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadUsers();

}


window.completeRefund =
completeRefund;
window.rejectPayment =
rejectPayment;
window.approvePayment =
approvePayment;
window.verifySeller =
verifySeller;
window.banUser =
banUser;

window.openAppealDetailModal =
function(orderId){

const order =
refundOrders.find(
  item => item._id === orderId
);

if(!order) return;

document.getElementById(
'appeal-detail-reason'
).innerText =
'Alasan banding: ' +
(order.appealReason || '-');


const photo =
document.getElementById(
'appeal-detail-photo'
);

if(order.appealPhoto){
photo.src = order.appealPhoto;
photo.style.display='block';
}else{
photo.style.display='none';
}


const video =
document.getElementById(
'appeal-detail-video'
);

if(order.appealVideo){
video.src = order.appealVideo;
video.style.display='block';
}else{
video.style.display='none';
}


document.getElementById(
'approve-appeal-btn'
).onclick =
()=>approveSellerAppeal(orderId);


document.getElementById(
'reject-appeal-btn'
).onclick =
()=>rejectSellerAppeal(orderId);


document.getElementById(
'appeal-detail-modal'
).style.display='block';

};



window.closeAppealDetailModal =
function(){

document.getElementById(
'appeal-detail-modal'
).style.display='none';

};

async function approveSellerAppeal(orderId){

try{

await fetch(
`${BASE_URL}/admin/appeal/${orderId}/approve`,
{
method:'PUT',
headers:{
Authorization:`Bearer ${token}`
}
}
);

alert('Banding seller diterima');

closeAppealDetailModal();
loadRefundRequests();

}catch(error){
console.log(error);
}

}


async function rejectSellerAppeal(orderId){

try{

const reason =
prompt('Alasan menolak banding seller');

if(!reason) return;

await fetch(
`${BASE_URL}/admin/appeal/${orderId}/reject`,
{
method:'PUT',
headers:{
'Content-Type':'application/json',
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
reason
})
}
);

alert('Banding seller ditolak');

closeAppealDetailModal();
loadRefundRequests();

}catch(error){
console.log(error);
}

}

window.previewTransferProof =
function(imageUrl){

const modal =
document.getElementById(
'transfer-proof-modal'
);

const image =
document.getElementById(
'transfer-proof-image'
);

image.src = imageUrl;
modal.style.display = 'flex';

};

window.closeTransferProofModal =
function(){

document.getElementById(
'transfer-proof-modal'
).style.display = 'none';

};

window.showPaymentProof = function(imageUrl){

  const modal = document.createElement('div');

  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 16px;
  `;

  modal.innerHTML = `
    <div
      style="
        position: relative;
        display:flex;
        align-items:center;
        justify-content:center;
        width:100%;
        height:100%;
      "
    >
      <img
        src="${imageUrl}"
        style="
          max-width:95%;
          max-height:85vh;
          object-fit:contain;
          border-radius:12px;
          background:white;
        "
      />

      <button
        onclick="this.closest('div').parentElement.remove()"
        style="
          position:absolute;
          top:20px;
          right:20px;
          width:42px;
          height:42px;
          border:none;
          border-radius:50%;
          background:red;
          color:#fff;
          font-size:24px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        ×
      </button>
    </div>
  `;

  document.body.appendChild(modal);

};

/* ==============================
DASHBOARD STATS
============================== */

async function loadDashboardStats(){

try{

const usersRes = await fetch(
`${BASE_URL}/admin/users`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const usersData =
await usersRes.json();

const users =
usersData.users || [];


const ordersRes = await fetch(
`${BASE_URL}/admin/orders`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const ordersData =
await ordersRes.json();

const orders =
ordersData.orders || [];


/* USER */

const buyers =
users.filter(
u => u.role === 'buyer'
);

const sellers =
users.filter(
u => u.role === 'seller'
);

const verifiedSeller =
sellers.filter(
u => u.isVerifiedSeller
);

const pendingSeller =
sellers.filter(
u => !u.isVerifiedSeller
);

const bannedUser =
users.filter(
u => u.isBanned
);


/* ORDER */

const waitingPayment =
orders.filter(
o =>
o.paymentStatus === 'waiting_verification'
);

const completedOrder =
orders.filter(
o =>
o.status === 'completed'
);

const refundRequest =
orders.filter(
o =>
o.refundRequest === true
);

const refundRejected =
orders.filter(
o =>
o.refundStatus === 'rejected'
);


/* REVENUE */

const grossRevenue =
orders.reduce(
(sum,order)=>
sum + Number(order.totalPrice || 0),
0
);

const marketplaceFee =
grossRevenue * 0.03;


/* SET HTML */

setText(
'total-users',
users.length
);

setText(
'total-sellers',
sellers.length
);

setText(
'total-orders',
orders.length
);

setText(
'total-revenue',
'Rp ' +
grossRevenue.toLocaleString('id-ID')
);

setText(
'marketplace-fee',
'Rp ' +
Math.round(
marketplaceFee
).toLocaleString('id-ID')
);

setText(
'buyer-count',
buyers.length
);

setText(
'seller-pending',
pendingSeller.length
);

setText(
'seller-verified',
verifiedSeller.length
);

setText(
'banned-user',
bannedUser.length
);

setText(
'waiting-payment',
waitingPayment.length
);

setText(
'completed-order',
completedOrder.length
);

setText(
'refund-count',
refundRequest.length
);

setText(
'refund-rejected',
refundRejected.length
);


renderSalesChart(orders);

}catch(error){

console.log(
'DASHBOARD ERROR:',
error
);

}

}


function setText(id,value){

const el =
document.getElementById(id);

if(el){
el.innerText = value;
}

}


/* CHART */
function renderSalesChart(orders){

const map = {};
const labels = [];
const values = [];

for(let i = 6; i >= 0; i--){

const d = new Date();
d.setDate(d.getDate() - i);

const key =
d.toISOString().split('T')[0];

const label =
d.toLocaleDateString(
'id-ID',
{
day:'2-digit',
month:'short'
}
);

labels.push(label);
map[key] = 0;

}

orders.forEach(order=>{

if(!order.createdAt) return;

const key =
new Date(order.createdAt)
.toISOString()
.split('T')[0];

if(map[key] !== undefined){
map[key] += Number(
order.totalPrice || 0
);
}

});

Object.keys(map).forEach(key=>{
values.push(map[key]);
});

const canvas =
document.getElementById('sales-chart');

if(!canvas) return;

const oldChart =
Chart.getChart(canvas);

if(oldChart){
oldChart.destroy();
}

new Chart(canvas,{
type:'bar',
data:{
labels,
datasets:[{
  data: values,
  backgroundColor: gradient,
  borderRadius: 12,
  borderSkipped: false,
  maxBarThickness: 18,
  barPercentage: 0.45,
  categoryPercentage: 0.65
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
  legend:{
    display:false
  }
}
    formatter:function(value){
      if(value === 0) return '';
      return 'Rp ' + value.toLocaleString('id-ID');
    }
  }
}
}
});

}
loadUsers();
loadPendingPayments();
loadOngoingOrders();
loadRefundRequests();
if(document.getElementById('total-users')){
  loadDashboardStats();
}
