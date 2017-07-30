/**
 * Created by alexn on 29/07/2017.
 */
/**
 * Created by alexn on 31/05/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var random = require('mongoose-random')
var uniqueValidator = require('mongoose-unique-validator')

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

/*UserSchema.pre('save', function (next) {
 this.username = this.username.toLowerCase()
 next()
 })*/
UserSchema.plugin(uniqueValidator)

UserSchema.index({username: 1}, {collation: {locale: 'en', strength: 2}})

/*
 UserSchema.plugin(random, {path: 'r'})
 */
module.exports = mongoose.model('TU', UserSchema)