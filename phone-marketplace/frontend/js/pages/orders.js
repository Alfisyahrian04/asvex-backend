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

${order.status || 'pending'}

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
