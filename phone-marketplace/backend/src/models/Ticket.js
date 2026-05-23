const mongoose =
require('mongoose');

const TicketSchema =
new mongoose.Schema({

user:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

title:{
type:String,
required:true
},

message:{
type:String,
required:true
},

status:{
type:String,
enum:[
'open',
'processing',
'closed'
],
default:'open'
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Ticket',
TicketSchema
);
