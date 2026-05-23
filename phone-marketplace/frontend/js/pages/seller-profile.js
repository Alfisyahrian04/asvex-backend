const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

const token =
localStorage.getItem(
'token'
);

if(
!currentUser
){

window.location.href =
'login.html';

}

if(
currentUser.role !==
'seller'
){

window.location.href =
'index.html';

}

const usernameElement =
document.getElementById(
'profile-username'
);

const emailElement =
document.getElementById(
'profile-email'
);

if(usernameElement){

usernameElement.innerText =
currentUser.username ||
'Seller';

}

if(emailElement){

emailElement.innerText =
currentUser.email ||
'-';

}

const logoutBtn =
document.getElementById(
'logout-btn'
);

if(logoutBtn){

logoutBtn.addEventListener(
'click',
()=>{

localStorage.removeItem(
'user'
);

localStorage.removeItem(
'token'
);

window.location.href =
'login.html';

}
);

}

const changePasswordBtn =
document.getElementById(
'change-password-btn'
);

if(changePasswordBtn){

changePasswordBtn.addEventListener(
'click',
async()=>{

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

alert(
'Lengkapi semua field'
);

return;

}

if(
newPassword !==
confirmPassword
){

alert(
'Konfirmasi password tidak sama'
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

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Gagal ganti password'
);

return;

}

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

}catch(error){

console.log(error);

alert(
'Server error'
);

}

}
);

}

/* TOGGLE PASSWORD */

const toggleButtons =
document.querySelectorAll(
'.toggle-password'
);

toggleButtons.forEach(
(button)=>{

button.addEventListener(
'click',
function(){

const target =
this.dataset.toggle;

const input =
document.querySelector(
target
);

if(!input){

return;

}

if(
input.type ===
'password'
){

input.type =
'text';

this.classList.remove(
'fa-eye'
);

this.classList.add(
'fa-eye-slash'
);

}else{

input.type =
'password';

this.classList.remove(
'fa-eye-slash'
);

this.classList.add(
'fa-eye'
);

}

}
);

}
);
