const mongoose =
require('mongoose');

const schema =
new mongoose.Schema({

  userId: String,

  action: String,

  module: String,

  metadata: Object

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'AuditLog',
  schema
);
