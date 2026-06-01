const http =
require('http');

const app =
require('./app');

const connectDB =
require('./config/db');

const {
initSocket
} = require(
'./config/socket'
);

const PORT =
process.env.PORT || 8080;

connectDB();

const server =
http.createServer(app);

initSocket(server);

server.listen(PORT,()=>{

console.log(
`Server running on ${PORT}`
);

});
