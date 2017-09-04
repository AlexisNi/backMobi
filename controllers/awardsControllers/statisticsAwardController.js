var ArenaQuestions = require('../../models/activeArena')
var ArenaUser = require('../../models/arena')
var Awards = require('../../models/awards')
var Statistics = require('../../models/statistics')
var User = require('../../models/user')
var level
var experience
var HistoryLogs = require('../../models/history');

exports.statisticsAdded=function (req,res,next,userId,result) {
  Statistics.findOne({user: userId}).exec(function (err, statistics) {
    if (err) {
      res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    try {
      statistics.currentExp = statistics.currentExp + result.awards.winner.experience
      statistics.wins = statistics.wins + 1
      var levelInfo = require('.././checkLevelUp')(statistics.level, statistics.currentExp)
      statistics.currentExp = levelInfo.currentExperience;
      statistics.level = levelInfo.level;
      statistics.save(function (err, statsResult) {
        var loserId = result.awards.loser.userId
        require('.././historicData').historicWinner(req, res, next, userId, loserId)
        User.findOne({_id: userId})
          .populate({path: 'arenas', match: {_id: arenaId}})
          .exec(function (err, user) {
            console.log('inside users')

            if (err) {
              res.status(500).json({
                message: 'Unexpected Error',
                error: err

              })
            }
            try {
              result.awards.winner.received = true
              result.save()
              user.arenas.pull({_id: arenaId})
              user.save(function (err, saveres) {
                if (err) {
                  return res.status(500).json({

                    where: 'Awards',
                    message: 'Unexpected error',
                    error: err
                  })
                }
                ArenaUser.findOne({_id: arenaId})
                  .exec(function (err, arena) {
                    if (err) {
                      return res.status(500).json({
                        message: 'Unexpected Error',
                        error: err

                      })
                    }
                    try {
                      if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP1.received == true
                        || result.awards.winner.received == true && result.awards.loser.received == true) {

                        arena.remove(function (err, result) {
                          if (err) {
                            return res.status(500).json({
                              where: 'Awards',
                              message: 'Unexpected error',
                              error: err

                            })
                          }
                          if (result) {
                            result.remove(function (err, resu) {
                              if (err) {
                                return res.status(500).json({
                                  where: 'Awards',
                                  message: 'Unexpected error',
                                  error: err

                                })
                              }
                              return res.status(200).json({
                                message: 'All delete'
                              })

                            })

                          }

                        })

                      }
                      else {
                        return res.status(200).json({
                          message: 'All updated'
                        })

                      }
                    } catch (err) {
                      return res.status(500).json({
                        where: 'Awards',
                        message: 'Unexpected error',
                        error: err

                      })
                    }
                  })

              })
            } catch (err) {
              return res.status(500).json({
                where: 'Awards',
                message: 'Unexpected error',
                error: err

              })
            }
          })

      })
    } catch (err) {
      return res.status(500).json({
        where: 'Awards',
        message: 'Unexpected error',
        error: err
      })
    }

  })


}