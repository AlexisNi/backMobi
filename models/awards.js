/**
 * Created by alex on 19/02/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  arenaId: String,
  draw:{type:Boolean,default:false},
  awards: {
    winner: {
      userId: String,
      points: Number,
      experience: Number,
      correctAnswers:Number,
      received: {type: Boolean, default: false}
    },
    loser: {
      userId: String,
      points: Number,
      experience: Number,
      correctAnswers:Number,
      received: {type: Boolean, default: false}
    },
    draw: {
      receivedP1: {
        userId: {
          type: String
        },
        received: {
          type: Boolean,
          default: false
        },
        points: {
          type: Number
        },
        experience: Number,
        correctAnswers:Number
      },
      receivedP2: {
        userId: {
          type: String
        },
        received: {
          type: Boolean,
          default: false
        },
        points: {
          type: Number
        },
        experience: Number,
        correctAnswers:Number

      }

    }

  }
})

module.exports = mongoose.model('Awards', schema)