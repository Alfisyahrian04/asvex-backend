const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  role: String,

  permissions: [String]

});

module.exports =
mongoose.model(
  'Permission',
  schema
);
