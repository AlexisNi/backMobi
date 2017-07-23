
var User = require('../models/user')
var HistoryLogs = require('../models/history');

exports.historicWinner = function (req, res, next, userId, loserId) {
  User.findOne({_id: userId}).exec(function (err, winnerUser) {
    if (err) {
      return res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    if (winnerUser) {
      HistoryLogs.findOne({$and: [{userId: userId, opponentId: loserId}]}).exec(function (err, history) {
        if (err) {
          return res.status(500).json({
            message: 'Unexpected Error'
          })
        }
        if (history == undefined || history == null) {
          console.log('New History')
          var newHistory = new HistoryLogs({
            userId: userId,
            opponentId: loserId,
            loses: 0,
            draws: 0,
            wins: 1

          })
          newHistory.save(function (err, historyRes) {
            if (err) {
            console.log(err);
            }
            winnerUser.history.push(historyRes)
            winnerUser.save()
          })

        } else {
          history.wins = history.wins + 1
          history.save();
        }
      })
    }

  })

}

exports.historicLoser = function (req, res, next, userId, winnerId) {
  User.findOne({_id: userId}).exec(function (err, loserUser) {
    if (err) {
      return res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    if (loserUser) {
      HistoryLogs.findOne({$and: [{userId: userId, opponentId: winnerId}]}).exec(function (err, history) {
        if (err) {
          return res.status(500).json({
            message: 'Unexpected Error'
          })
        }
        if (history == undefined || history == null) {
          console.log('New History')
          var newHistory = new HistoryLogs({
            userId: userId,
            opponentId: winnerId,
            loses: 1,
            draws: 0,
            wins: 0
          })
          newHistory.save(function (err, historyRes) {
            console.log(res);
            if (err) {
              console.log(err);

            }
            loserUser.history.push(historyRes)
            loserUser.save()
          })

        } else {
          history.loses = history.loses + 1
          history.save();
        }
      })
    }

  })

}
exports.historicDraw=function (req,res,next,userId, otherId) {
  User.findOne({_id: userId}).exec(function (err, user) {
    if (err) {
      return res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    if (user) {
      HistoryLogs.findOne({$and: [{userId: userId, opponentId: otherId}]}).exec(function (err, history) {
        if (err) {
          return res.status(500).json({
            message: 'Unexpected Error'
          })
        }
        if (history == undefined || history == null) {
          console.log('New History')
          var newHistory = new HistoryLogs({
            userId: userId,
            opponentId: otherId,
            loses: 0,
            draws: 1,
            wins: 0
          })
          newHistory.save(function (err, historyRes) {
            console.log(res)
            if (err) {
         console.log(err);
            }
            user.history.push(historyRes)
            user.save()
          })

        } else {
          history.draws = history.draws + 1
          history.save(function (err,result) {

          });
        }
      })
    }

  })
  
}