var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'Users', unique: true},
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }
  ],
  validate: [arrayLimit]

});

function arrayLimit(val) {
  return val.length <= 30;
}

module.exports = mongoose.model('FriendList', schema)