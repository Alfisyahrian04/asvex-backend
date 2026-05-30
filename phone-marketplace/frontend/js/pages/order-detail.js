const params =
new URLSearchParams(
window.location.search
);

const orderId =
params.get('id');

const container =
document.getElementById(
'order-detail-container'
);

async function loadOrderDetail(){

try{

const response =
await fetch(
`${window.API_URL}/orders/${orderId}`,
{
headers:{
Authorization:
`Bearer ${localStorage.getItem('token')}`
}
}
);

const data =
await response.json();

const order =
data.order;

container.innerHTML = `
<div class="detail-card">

<img
src="${
order.product?.images?.[0] ||
'https://via.placeholder.com/300'
}"
style="
width:100%;
border-radius:16px;
margin-bottom:16px;
"
/>

<h3>
${order.product?.name || 'Produk'}
</h3>

<p>
Qty: ${order.quantity || 1}
</p>

<p>
Rp ${Number(
order.totalPrice || 0
).toLocaleString('id-ID')}
</p>

${
order.trackingNumber
? `
<p>
No Resi:
${order.trackingNumber}
</p>
`
: ''
}

</div>
`;

}catch(error){

console.log(error);

container.innerHTML =
`
<div class="empty-product">
Gagal memuat detail pesanan
</div>
`;

}

}

loadOrderDetail();
