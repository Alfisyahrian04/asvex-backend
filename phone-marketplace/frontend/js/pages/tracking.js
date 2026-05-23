const params =
new URLSearchParams(
window.location.search
);

const trackingNumber =
params.get('resi');

const container =
document.getElementById(
'tracking-content'
);

async function loadTracking(){

try{

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/orders/my-orders',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const orders =
await response.json();

const order =
orders.find(
item =>
item.trackingNumber ===
trackingNumber
);

if(!order){

container.innerHTML =
'Tracking tidak ditemukan';

return;

}

container.innerHTML = `

<div class="tracking-card">

<h2>
${order.product?.name}
</h2>

<p>
Resi:
${order.trackingNumber}
</p>

<p>
Status:
${order.deliveryStatus}
</p>

<div class="timeline">

${order.timeline.map(item=>`

<div class="timeline-item">

<h3>
${item.title}
</h3>

<p>
${item.description}
</p>

</div>

`).join('')}

</div>

</div>

`;

}catch(error){

container.innerHTML =
'Gagal memuat tracking';

}

}

loadTracking();
