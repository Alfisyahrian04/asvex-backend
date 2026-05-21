require('dotenv').config();

const http = require('http');

const app = require('./app');

const connectDB = require('./config/db');

const initSocket = require('./config/socket');

(async () => {

  await connectDB();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(process.env.PORT, () => {

    console.log(
      `SERVER RUNNING ${process.env.PORT}`
    );

  });

})();
