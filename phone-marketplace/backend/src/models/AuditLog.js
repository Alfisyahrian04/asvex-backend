const mongoose =
require('mongoose');

const AuditLogSchema =
new mongoose.Schema({

admin:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

action:{
type:String,
required:true
},

targetUser:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

description:{
type:String,
default:''
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'AuditLog',
AuditLogSchema
);
