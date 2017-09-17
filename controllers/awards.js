var ArenaQuestions = require('../models/activeArena')
var ArenaUser = require('../models/arena')
var Awards = require('../models/awards')
var Statistics = require('../models/statistics')
var User = require('../models/user')
var level
var experience
var HistoryLogs = require('../models/history');
var statisticAwardController=require('../controllers/awardsControllers/statisticsAwardController');

exports.awards = function (req, res, next) {
  console.log('awards')
  var arenaId = req.body.arenaId
  var userId = req.body.userId

  Statistics.findOne({user: userId}).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Fail',
      })
    }
    if (!result) {
      var statistics = new Statistics({user: userId})
      statistics.save()

      /*  return res.status(200).json({
       message: 'success',
       });*/
    }
  })

  Awards.findOne().where({arenaId: arenaId})
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          message: 'Unexpected Error'

        })
      }
      try {
        if (result.awards.winner.userId == userId) {
          try {
            if (result.awards.winner.received != false) {
              res.status(500).json({
                where: 'At awards',
                title: 'Error',
                message: 'You already received that award....',
                status: '500',
                error: err
              })

            } else {
              statisticAwardController.statisticsAddedWinner(req,res,next,userId,result,arenaId).then(function (message) {
                return res.status(200).json({
                  message: message.message
                })
                }
              ).catch(function (err) {
               return res.status(500).json({
                  where: err.where,
                  message: err.message,
                  error: err.error
                })
                }
              )

            }
          } catch (err) {
            return res.status(500).json({
              where: 'Awards',
              message: 'Unexpected error',
              error: err

            })
          }
        } else if (result.awards.loser.userId == userId) {

          if (result.awards.loser.received != false) {
            return res.status(500).json({
              where: 'At awards',
              title: 'Error',
              message: 'You already received that award....',
              status: '500',
              error: err

            })
          } else {
            statisticAwardController.statisticsAddedLoser(req,res,next,userId,result,arenaId).then(function (message) {
                return res.status(200).json({
                  message: message.message
                })
              }
            ).catch(function (err) {
                return res.status(500).json({
                  where: err.where,
                  message: err.message,
                  error: err.error
                })
              }
            )


          }
        } else {
          statisticAwardController.statisticsAddedDraw(req,res,next,userId,result,arenaId).then(function (message) {
              return res.status(200).json({
                message: message.message
              })
            }
          ).catch(function (err) {
              return res.status(500).json({
                where: err.where,
                message: err.message,
                error: err
              })
            }
          )

        }
      } catch (err) {
        return res.status(500).json({
          where: 'Awards',
          message: 'Unexpected error',
          error: err
        })

      }
    })
}

