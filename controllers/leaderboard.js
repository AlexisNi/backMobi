/**
 * Created by alexn on 21/09/2017.
 */
var User = require('../models/user')
var Statistics = require('../models/statistics')
var leaders = []
exports.leaderBoardCreate = function () {
  var leaderBoard = new Promise(function (resolve, reject) {
    Statistics.find()
      .sort({rating: -1})
      .exec(function (err, result) {
        if (err) {
          reject(err)
        }
        if (result) {
          for (var i = 0; i < result.length; i++) {
            result[i].previousRanking = result[i].ranking
            result[i].ranking = i + 1
            result[i].save();

          }
          resolve('finished')

        }

      })
  })

  leaderBoard.then(function (result) {
    User.find({})
      .select('username')
      .select('statistics')
      .populate({path: 'statistics', select:['rating','ranking','previousRanking']})
      .exec(function (err, res) {
        if (err) {
        }
        if (res) {

          leaders = res.sort(function (a, b) {
            if (a.statistics.rating < b.statistics.rating) {
              return 1
            }
            if (a.statistics.rating > b.statistics.rating) {
              return -1
            } else {
              return 0
            }
          })

          leaders = leaders.slice(0, 100)
        }
      })
  }).catch(function (err) {
    console.log(err)

  })

}
exports.getLeaderBoard = function (req, res, next) {

  if (leaders) {
    return res.status(200).json({
      message: 'Leaders retured',
      leaders: leaders
    })

  } else {
    return res.status(500).json({
      title: 'An error occured',
    })
  }

}