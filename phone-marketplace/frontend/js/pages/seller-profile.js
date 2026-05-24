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

/* AUTH */

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

/* PROFILE */

const usernameElement =
document.getElementById(
'profile-username'
);

const emailElement =
document.getElementById(
'profile-email'
);

/* PATCH START */
const phoneElement =
document.getElementById(
'profile-phone'
);

const returnAddressInput =
document.getElementById(
'return-address'
);
/* PATCH END */

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

/* PATCH START */
if(phoneElement){

phoneElement.innerText =
currentUser.phone || '-';

}

if(returnAddressInput){

returnAddressInput.value =
currentUser.returnAddress || '';

}

const saveReturnBtn =
document.getElementById(
'save-return-address-btn'
);

if(saveReturnBtn){

saveReturnBtn.addEventListener(
'click',
()=>{

currentUser.returnAddress =
returnAddressInput.value.trim();

localStorage.setItem(
'user',
JSON.stringify(currentUser)
);

alert(
'Alamat retur berhasil disimpan'
);

}
);

}
/* PATCH END */

/* LOGOUT */

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

/* CHANGE PASSWORD */

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

alert(
'Lengkapi semua field'
);

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

if(
newPassword !==
confirmPassword
){

alert(
'Konfirmasi password tidak sama'
);

return;

}

changePasswordBtn.disabled =
true;

changePasswordBtn.innerText =
'Menyimpan...';

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

changePasswordBtn.disabled =
false;

changePasswordBtn.innerText =
'Simpan Password';

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

changePasswordBtn.disabled =
false;

changePasswordBtn.innerText =
'Simpan Password';

}
);

}

/* TOGGLE PASSWORD */

window.togglePassword =
function(
inputId,
button
){

const input =
document.getElementById(
inputId
);

if(!input){

return;

}

const icon =
button.querySelector(
'i'
);

if(
input.type ===
'password'
){

input.type =
'text';

icon.classList.remove(
'fa-eye'
);

icon.classList.add(
'fa-eye-slash'
);

}else{

input.type =
'password';

icon.classList.remove(
'fa-eye-slash'
);

icon.classList.add(
'fa-eye'
);

}

};
