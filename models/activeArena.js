var mongoose = require('mongoose')
var Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator')

var schema = new Schema({
  arenaId: {type: Schema.Types.ObjectId, ref: 'Arena'},
  userId: {type: Schema.Types.ObjectId, ref: 'Users'},
  questionAnswer: [{
    questionId: String,
    answer: Boolean,
    time: Number
  }]

})

schema.index({arenaId: 1, userId: 1}, {unique: true})
schema.plugin(uniqueValidator)
module.exports = mongoose.model('ArenaQuestion', schema)