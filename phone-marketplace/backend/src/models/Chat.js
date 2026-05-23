const mongoose =
require('mongoose');

const ChatSchema =
new mongoose.Schema({

sender:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

receiver:{
type:
mongoose.Schema.Types.ObjectId,
ref:'User'
},

message:{
type:String,
required:true
},

isRead:{
type:Boolean,
default:false
}

},{
timestamps:true
});

module.exports =
mongoose.model(
'Chat',
ChatSchema
);
