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
