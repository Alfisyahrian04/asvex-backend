const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  token: String,

  expiredAt: Date

});

module.exports =
mongoose.model(
  'EmailVerification',
  schema
);
