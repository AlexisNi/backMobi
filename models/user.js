/**
 * Created by alexn on 31/05/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema({
  firebaseId:{
    type: String,
    required:true,
    unique:true
  },
  username: {
    type: String,
    required:true,
    trim:true,
    unique: true
  },
  arenas:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Arena'
    }
  ],
  statistics:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Stats'
    }
  ],
  lastLogin:{
    typed:Date
  },
  deviceToken:[{
    type: Schema.Types.ObjectId,
    ref: 'DeviceTokens'
  }]
})

UserSchema.pre('save',function (next) {
  this.username=this.username.toLowerCase();
  next();


})

module.exports = mongoose.model('Users', UserSchema);