/**
 * Created by alexn on 20/07/2017.
 */
var ArenaQuestions = require('../models/activeArena')
var ArenaUser = require('../models/arena')
var Awards = require('../models/awards')
var Statistics = require('../models/statistics')
var User = require('../models/user')
var level
var experience
var HistoryLogs = require('../models/history')


exports.historicWinner=function (userId,loserId) {
  User.findOne({_id: userId}).exec(function (err, winnerUser) {
    if (err) {
      return res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    if (winnerUser) {
      HistoryLogs.findOne({userId: userId}).exec(function (err, history) {
        if (err) {
          return res.status(500).json({
            message: 'Unexpected Error'
          });
        }
        if (history == undefined || history == null) {
          var newHistory = new HistoryLogs({
            user: winnerUser,
            history: [{
              user:
                {
                  userId: loserId,
                  loses:0,
                  draws:0,
                  wins:1
                }

            }]
          })
          newHistory.save();
        }
      })
    }

  })

}