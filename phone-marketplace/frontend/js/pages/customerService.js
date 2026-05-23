protectPage();

requireRole(
'customer_service'
);

async function loadComplaints(){

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/complaints',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const complaints =
await response.json();

const container =
document.getElementById(
'complaint-list'
);

container.innerHTML =
complaints.map(item=>`

<div class="complaint-card">

<h3>
${item.buyer?.username}
</h3>

<p>
${item.reason}
</p>

<p>
${item.status}
</p>

<button
onclick="
resolveComplaint(
'${item._id}'
)
"
>

Resolve

</button>

</div>

`).join('');

}

async function resolveComplaint(id){

const token =
localStorage.getItem(
'token'
);

await fetch(
`https://asvex-backend-production.up.railway.app/api/v1/complaints/${id}`,
{
method:'PUT',

headers:{
'Content-Type':
'application/json',

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({
status:'resolved'
})

}
);

loadComplaints();

}

loadComplaints();
