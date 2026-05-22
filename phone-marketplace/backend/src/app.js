const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const compression = require('compression');

const mongoSanitize =
require('express-mongo-sanitize');

const rateLimit =
require('express-rate-limit');

const xss =
require('xss-clean');

const hpp =
require('hpp');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(helmet());

app.use(compression());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use(express.json({
  limit: '50mb'
}));

app.use(rateLimit({

  windowMs:
    15 * 60 * 1000,

  max: 300

}));

app.use(
  '/api/v1/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/v1/products',
  require('./routes/productRoutes')
);

app.use(
  '/api/v1/orders',
  require('./routes/orderRoutes')
);

app.use(
  '/api/v1/search',
  require('./routes/searchRoutes')
);

app.use(
  '/api/v1/reviews',
  require('./routes/reviewRoutes')
);

app.use(
  '/api/v1/seller',
  require('./routes/sellerRoutes')
);

app.use(
  '/api/v1/admin',
  require('./routes/adminRoutes')
);

app.use(
  '/api/v1/notifications',
  require('./routes/notificationRoutes')
);

app.get(
  '/',
  (req, res) => {

    res.send(
      'API RUNNING'
    );

  }
);

app.use(
  '/health',
  require('./routes/healthRoutes')
);

module.exports = app;
