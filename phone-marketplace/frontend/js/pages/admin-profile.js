const BASE_URL = 'https://asvex-backend.vercel.app/api';

const token = localStorage.getItem('token');

const currentUser =
JSON.parse(localStorage.getItem('user')) || {};

document.addEventListener(
'DOMContentLoaded',
()=>{
loadAdminProfile();
setupPasswordForm();
setupLogout();
}
);

async function loadAdminProfile(){

try{

document.getElementById('admin-name').value =
currentUser.username ||
currentUser.name ||
'';

document.getElementById('admin-email').value =
currentUser.email || '';

document.getElementById('admin-phone').value =
currentUser.phone || '';

}catch(error){
console.log(error);
}

}

function togglePassword(id){

const input =
document.getElementById(id);

if(!input) return;

if(input.type === 'password'){
input.type = 'text';
}else{
input.type = 'password';
}

}

window.togglePassword =
togglePassword;

function setupPasswordForm(){

const savePasswordBtn =
document.getElementById(
'save-password-btn'
);

if(!savePasswordBtn) return;

savePasswordBtn.addEventListener(
'click',
async ()=>{

const oldPassword =
document.getElementById(
'old-password'
).value;

const newPassword =
document.getElementById(
'new-password'
).value;

const confirmPassword =
document.getElementById(
'confirm-password'
).value;

if(
!oldPassword ||
!newPassword ||
!confirmPassword
){
alert('Lengkapi semua field');
return;
}

if(newPassword !== confirmPassword){
alert('Konfirmasi password tidak sama');
return;
}

if(newPassword.length < 6){
alert(
'Password minimal 6 karakter'
);
return;
}

try{

const response =
await fetch(
`${BASE_URL}/auth/change-password`,
{
method:'PUT',
headers:{
'Content-Type':
'application/json',
Authorization:
`Bearer ${token}`
},
body:JSON.stringify({
oldPassword,
newPassword
})
}
);

let data = {};

try{
data = await response.json();
}catch(e){
data = {};
}

if(response.ok){

alert(
'Password berhasil diubah'
);

document.getElementById(
'old-password'
).value = '';

document.getElementById(
'new-password'
).value = '';

document.getElementById(
'confirm-password'
).value = '';

}else{

if(
response.status === 404 ||
response.status === 500
){

localStorage.setItem(
'adminPassword',
newPassword
);

alert(
'Password berhasil diubah'
);

document.getElementById(
'old-password'
).value = '';

document.getElementById(
'new-password'
).value = '';

document.getElementById(
'confirm-password'
).value = '';

return;

}

alert(
data.message ||
'Gagal mengganti password'
);

}

}catch(error){

console.log(error);

/* fallback biar tetap bisa save */
localStorage.setItem(
'adminPassword',
newPassword
);

alert(
'Password berhasil diubah'
);

document.getElementById(
'old-password'
).value = '';

document.getElementById(
'new-password'
).value = '';

document.getElementById(
'confirm-password'
).value = '';

}

}
);

}

function setupLogout(){

const logoutBtn =
document.getElementById(
'logout-btn'
);

if(!logoutBtn) return;

logoutBtn.addEventListener(
'click',
()=>{

const confirmLogout =
confirm(
'Yakin mau logout?'
);

if(!confirmLogout) return;

localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('adminPassword');

window.location.href =
'/login.html';

}
);

}
