/**
 * Created by alex on 19/02/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  arenaId: String,
  awards: {
    winner: {
      userId: String, points: Number, experience: Number, received: {type: Boolean, default: false}
    },
    loser: {
      userId: String, points: Number, experience: Number, received: {type: Boolean, default: false}
    },
    draw: {
      userId: String, points: Number, experience: Number,
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
        experience: Number
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
        experience: Number
      }

    }

  }
})

module.exports = mongoose.model('Awards', schema)