var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  userId:{ type: Schema.Types.ObjectId, ref: 'Users' },
  token:{type:String,unique:true}
});

module.exports = mongoose.model('DeviceToken', schema);