/**
 * Created by alexn on 31/05/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var random = require('mongoose-random')
var uniqueValidator = require('mongoose-unique-validator')

var UserSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    uniqueCaseInsensitive: true,
    maxlength: [10,'Username must be less than 10 characters']

  },
  arenas: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Arena'
    }
  ],
  statistics: {
    type: Schema.Types.ObjectId,
    ref: 'Stats',
  },
  history: [{
    type: Schema.Types.ObjectId,
    ref: 'History'
  }]
  ,
  lastLogin: {
    typed: Date
  },
  hints:{
    type: Schema.Types.ObjectId,
    ref:'Hints'
  },
  deviceToken: [{
    type: Schema.Types.ObjectId,
    ref: 'DeviceTokens'
  }],
  last5Matches:[{result:String,userName:String}],
  awards:[{
    type: Schema.Types.ObjectId,
    ref: 'Awards'}],
  friendList:[{
    type: Schema.Types.ObjectId,
    ref: 'FriendList'
  }],

})


/*UserSchema.pre('save', function (next) {
 this.username = this.username.toLowerCase()
 next()
 })*/
UserSchema.plugin(uniqueValidator)
/*
UserSchema.index({username: 1}, {collation: {locale: 'en', strength: 2}})
*/
/*
 UserSchema.plugin(random, {path: 'r'})
 */
module.exports = mongoose.model('Users', UserSchema)