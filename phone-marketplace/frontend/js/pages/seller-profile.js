const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const currentUser =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(
!currentUser ||
currentUser.role !==
'seller'
){

window.location.href =
'login.html';

}

const token =
localStorage.getItem(
'token'
);

document.getElementById(
'profile-username'
).innerText =
currentUser.username ||
'Seller';

document.getElementById(
'profile-email'
).innerText =
currentUser.email ||
'-';

function logout(){

localStorage.removeItem(
'user'
);

localStorage.removeItem(
'token'
);

window.location.href =
'login.html';

}

async function
changePassword(){

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

window.logout =
logout;

window.changePassword =
changePassword;
