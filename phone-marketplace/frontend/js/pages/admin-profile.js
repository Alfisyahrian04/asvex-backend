const BASE_URL =
'https://asvex-backend.up.railway.app/api';

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

input.type =
input.type === 'password'
? 'text'
: 'password';

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
).value.trim();

const newPassword =
document.getElementById(
'new-password'
).value.trim();

const confirmPassword =
document.getElementById(
'confirm-password'
).value.trim();

if(
!oldPassword ||
!newPassword ||
!confirmPassword
){
alert('Lengkapi semua field');
return;
}

if(
newPassword !== confirmPassword
){
alert('Konfirmasi password tidak sama');
return;
}

if(
newPassword.length < 6
){
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
'Authorization':
`Bearer ${token}`
},
body:JSON.stringify({
oldPassword,
newPassword
})
}
);

const text =
await response.text();

let data = {};

try{
data = JSON.parse(text);
}catch{
data = { message:text };
}

if(response.ok){

alert(
'Password berhasil diubah'
);

document.getElementById(
'old-password'
).value='';

document.getElementById(
'new-password'
).value='';

document.getElementById(
'confirm-password'
).value='';

}else{

alert(
data.message ||
`Error ${response.status}`
);

}

}catch(error){

console.error(
'CHANGE PASSWORD:',
error
);

alert(
error.message ||
'Terjadi kesalahan'
);

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
