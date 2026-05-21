const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  token: String,

  device: String,

  ip: String,

  expiredAt: Date

});

module.exports =
mongoose.model(
  'Session',
  schema
);
