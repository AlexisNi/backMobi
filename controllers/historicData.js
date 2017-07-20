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

exports.historicWinner = function (req, res, next, userId, loserId) {
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
          })
        }
        if (history == undefined || history == null) {
          console.log('New History')
          var newHistory = new HistoryLogs({
            userId: userId,
            history: {
              user: {
                userId: loserId,
                loses: 0,
                draws: 0,
                wins: 1
              }
            }
          })
          newHistory.save(function (err, res) {
            if (err) {
              return res.status(500).json({
                message: 'Unexpected Error'
              })
            }
            winnerUser.history.push(res)
            winnerUser.save()
          })

        } else {
          HistoryLogs.findOne({history:{$elemMatch:{'user.userId':'5935380649622d308c9f4781'}}}).exec(function (err,res) {
            console.log(res);

          })

            /*    HistoryLogs.findOne({$and:[{userId:userId},
                   {history:{$elemMatch:{userId: loserId}}}]}).exec(function (err, historyUpdate) {
                   console.log(historyUpdate);
                   })*/
/*          HistoryLogs.findOne({$and: [{userId: userId}, {$elemMatch:{history: {user:{userId: loserId}}}}]}).exec(function (err, historyUpdate) {
            if (err) {
              return res.status(500).json({
                message: 'Unexpected Error'
              })
            }
            console.log(historyUpdate);
            if (historyUpdate) {
              historyUpdate.history.wins=historyUpdate.history.wins+1;
              historyUpdate.save();
            }else{
              var newHistoryPlayer = {user: {userId: winnerId, loses: 0, draws: 0, wins: 1}}
              historyUpdate.history.push(newHistoryPlayer)
              historyUpdate.save()
            }

          })*/
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
      HistoryLogs.findOne({userId: userId}).exec(function (err, history) {
        if (err) {
          return res.status(500).json({
            message: 'Unexpected Error'
          })
        }
        if (history == undefined || history == null) {
          console.log('New History')
          var newHistory = new HistoryLogs({
            userId: userId,
            history: {
              user: {
                userId: winnerId,
                loses: 1,
                draws: 0,
                wins: 0
              }
            }
          })
          newHistory.save(function (err, res) {
            console.log(res)
            if (err) {
              return res.status(500).json({
                message: 'Unexpected Error'
              })
            }
            loserUser.history.push(res);
            loserUser.save();
          })

        } else {
          HistoryLogs.findOne({$and:[{history:{$elemMatch:{'user.userId':winnerId}}},{userId:userId}]}).exec(function (err,res) {
            console.log(res.history[0].user);

          })
    /*      HistoryLogs.findOne({$and:[{userId:userId},
           {history:{$elemMatch:{userId:winnerId}}}]}).exec(function (err, historyUpdate) {

              console.log(historyUpdate);
         })*/
/*          HistoryLogs.findOne({$and: [{userId: userId},  {$elemMatch:{history: {user:{userId: winnerId}}}}]}).exec(function (err, historyUpdate) {
            console.log(historyUpdate);
            if (err) {
              return res.status(500).json({
                message: 'Unexpected Error'
              })
            }
            if (historyUpdate) {
              historyUpdate.history.wins=historyUpdate.history.loses+1;
              historyUpdate.save();
            } else {
              var newHistoryPlayer = {user: {userId: winnerId, loses: 1, draws: 0, wins: 0}}
              historyUpdate.history.push(newHistoryPlayer)
              historyUpdate.save()

            }

          })*/
        }
      })
    }

  })

}