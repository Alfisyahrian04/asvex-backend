const socket =
io(
'https://asvex-backend-production.up.railway.app'
);

const user =
JSON.parse(
localStorage.getItem(
'user'
)
);

if(user){

socket.emit(
'join-user-room',
user.id
);

}

window.socket = socket;
