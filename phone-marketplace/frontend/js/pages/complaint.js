protectPage();

async function submitComplaint(){

const params =
new URLSearchParams(
window.location.search
);

const orderId =
params.get('order');

const reason =
document.getElementById(
'reason'
).value;

const token =
localStorage.getItem(
'token'
);

await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/complaints',
{
method:'POST',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({

orderId,
reason,
evidence:[]

})

}
);

alert(
'Komplain berhasil dikirim'
);

window.location.href =
'orders.html';
}
