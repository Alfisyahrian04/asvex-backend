const express =
require('express');

const proxy =
require('express-http-proxy');

const app =
express();

app.use(
  '/auth',
  proxy(
    process.env.AUTH_SERVICE
  )
);

app.use(
  '/product',
  proxy(
    process.env.PRODUCT_SERVICE
  )
);

app.use(
  '/order',
  proxy(
    process.env.ORDER_SERVICE
  )
);

module.exports = app;
