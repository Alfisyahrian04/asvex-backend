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

socket.on(
'join-user-room',
(userId)=>{

socket.join(userId);

});

socket.on(
'chat-message',
(data)=>{

io.to(
data.receiverId
).emit(
'new-chat-message'
);

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
