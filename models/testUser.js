/**
 * Created by alexn on 29/07/2017.
 */
/**
 * Created by alexn on 31/05/2017.
 */
var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    uniqueCaseInsensitive: true
  }
})


UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('TU', UserSchema)