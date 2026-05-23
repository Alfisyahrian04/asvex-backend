const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

const registerForm =
document.getElementById(
'registerForm'
);

const roleSelect =
document.getElementById(
'role'
);

const adminWrap =
document.getElementById(
'adminWrap'
);

if(roleSelect){

roleSelect.addEventListener(
'change',
()=>{

if(
roleSelect.value ===
'admin'
){

adminWrap.style.display =
'flex';

}else{

adminWrap.style.display =
'none';

}

}
);

}

if(registerForm){

registerForm.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const username =
document.getElementById(
'username'
).value.trim();

const email =
document.getElementById(
'email'
).value.trim();

const password =
document.getElementById(
'password'
).value.trim();

const role =
document.getElementById(
'role'
).value;

const adminKey =
document.getElementById(
'adminKey'
)?.value || '';

if(
!username ||
!email ||
!password
){

alert(
'Lengkapi semua field'
);

return;

}

if(
role === 'admin' &&
adminKey !==
'AL-GADGET-ADMIN'
){

alert(
'Admin key salah'
);

return;

}

try{

const response =
await fetch(
`${BASE_URL}/auth/register`,
{
method:'POST',

headers:{
'Content-Type':
'application/json'
},

body:JSON.stringify({
username,
email,
password,
role,
adminKey
})
}
);

const data =
await response.json();

if(!response.ok){

alert(
data.message ||
'Register gagal'
);

return;

}

alert(
'Register berhasil'
);

window.location.href =
'login.html';

}catch(err){

console.log(err);

alert(
'Server error'
);

}

});
}
