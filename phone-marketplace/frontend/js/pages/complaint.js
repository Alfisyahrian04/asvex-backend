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

/* PATCH */
const videoInput =
document.getElementById(
'unboxing-video'
);
/* PATCH */

const formData =
new FormData();

formData.append(
'orderId',
orderId
);

formData.append(
'reason',
reason
);

if(
videoInput?.files?.[0]
){
formData.append(
'unboxingVideo',
videoInput.files[0]
);
}

await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/complaints',
{
method:'POST',
headers:{
Authorization:
`Bearer ${token}`
},
body:formData
}
);

alert(
'Komplain berhasil dikirim'
);

window.location.href =
'orders.html';

}
