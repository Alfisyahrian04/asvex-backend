protectPage();

requireRole('seller');

async function loadWallet(){

try{

const token =
localStorage.getItem(
'token'
);

const response =
await fetch(
'https://asvex-backend-production.up.railway.app/api/v1/seller/wallet',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

const wallet =
await response.json();

document.getElementById(
'wallet-balance'
).innerText =

`Rp ${Number(wallet.balance)
.toLocaleString('id-ID')}`;

}catch(error){

console.log(error);

}

}

loadWallet();
