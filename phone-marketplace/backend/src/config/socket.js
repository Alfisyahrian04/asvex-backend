const socketIo =
require('socket.io');

let io;

const initSocket =
(server)=>{

io = socketIo(server,{
cors:{
origin:'*'
}
});

io.on(
'connection',
(socket)=>{

console.log(
'User connected:',
socket.id
);

socket.on(
'join-user-room',
(userId)=>{

socket.join(userId);

});

socket.on(
'disconnect',
()=>{

console.log(
'User disconnected'
);

});

});

return io;

};

const getIO = ()=>{

if(!io){

throw new Error(
'Socket not initialized'
);

}

return io;

};

module.exports = {
initSocket,
getIO
};
