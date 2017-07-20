var ArenaQuestions = require('../models/activeArena')
var ArenaUser = require('../models/arena')
var Awards = require('../models/awards')
var Statistics = require('../models/statistics')
var User = require('../models/user')
var level
var experience
var HistoryLogs = require('../models/history')
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
              Statistics.findOne({user: userId}).exec(function (err, statistics) {
                if (err) {
                  res.status(500).json({
                    message: 'Unexpected Error'
                  })
                }

                try {
                  statistics.currentExp = statistics.currentExp + result.awards.winner.experience
                  statistics.wins = statistics.wins + 1
                  var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp)
                  statistics.currentExp = levelInfo.currentExperience
                  statistics.level = levelInfo.level
                  statistics.save(function (err, statsResult) {
                    var loserΙd = result.awards.loser.userId
                    require('./historicData').historicWinner(userId,loserΙd);
/*                    User.findOne({_id: userId}).exec(function (err, winnerUser) {
                      if (err) {
                        return res.status(500).json({
                          message: 'Unexpected Error'
                        })
                      }
                      if (winnerUser) {
                        HistoryLogs.findOne({userId: userId}).exec(function (err, history) {
                          var loserΙd = result.awards.loser.userId
                          if (err) {
                            return res.status(500).json({
                              message: 'Unexpected Error'
                            })
                          }
                          if (history == undefined || history == null) {
                            var newHistory = new HistoryLogs({
                              user: winnerUser,
                              history: [{
                                user:
                                  {
                                    userId: loserΙd,
                                    loses:0,
                                    draws:0,
                                    wins:1
                                  }

                              }]
                            })
                            console.log(newHistory);
                            newHistory.save();
                          }
                        })
                      }

                    })*/

                  })
                } catch (err) {
                  return res.status(500).json({
                    where: 'Awards',
                    message: 'Unexpected error',
                    error: err
                  })
                }

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
                              if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
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
            Statistics.findOne({user: userId}).exec(function (err, statistics) {
              if (err) {
                return res.status(500).json({
                  message: 'Unexpected Error',
                  error: err

                })
              }
              statistics.currentExp = statistics.currentExp + result.awards.loser.experience
              statistics.loses = statistics.loses + 1
              console.log('here is level')
              var levelInfo = require('./LevelUp')(statistics.level, statistics.currentExp)
              statistics.currentExp = levelInfo.currentExperience
              statistics.level = levelInfo.level
              statistics.save()
            })
            User.findOne({_id: userId})
              .populate({path: 'arenas', match: {_id: arenaId}})
              .exec(function (err, user) {
                if (err) {
                  return res.status(500).json({
                    message: 'Unexpected Error',
                    error: err

                  })
                }
                result.awards.loser.received = true
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
                      console.log('Arenas delete')

                      if (err) {
                        return res.status(500).json({
                          message: 'Unexpected Error',
                          error: err

                        })
                      }
                      if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
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
                    })
                })
              })
          }
        } else {
          Statistics.findOne({user: userId}).exec(function (err, statistics) {
            if (result.awards.draw.receivedP2 == userId) {
              return res.status(500).json({
                where: 'Awards',
                message: 'Award already received',
                error: err
              })
            } else if (result.awards.draw.receivedP1 == userId) {
              return res.status(500).json({
                where: 'Awards',
                message: 'Award already received',
                error: err
              })
            } else {
              statistics.currentExp = statistics.currentExp + result.awards.draw.experience
              statistics.points = statistics.points + 1
              statistics.draws = statistics.draws + 1
              console.log('here is level')
              var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp)
              statistics.currentExp = levelInfo.currentExperience
              statistics.level = levelInfo.level
              statistics.save()

              if (result.awards.draw.receivedP1 == '123') {
                result.awards.draw.receivedP1 = userId
                result.save()
                User.findOne({_id: userId})
                  .populate({path: 'arenas', match: {_id: arenaId}})
                  .exec(function (err, user) {
                    if (err) {
                      return res.status(500).json({
                        message: 'Unexpected Error',
                        error: err

                      })
                    }
                    user.arenas.pull({_id: arenaId})
                    user.save(function (err, saveres) {
                      if (err) {
                        return res.status(500).json({
                          where: 'Awards',
                          message: 'Unexpected error',
                          err: err
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
                          if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
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
                          } else {
                            return res.status(200).json({
                              message: 'All updated'
                            })
                          }
                        })

                    })
                  })
              }
              else if (result.awards.draw.receivedP2 == '123') {
                result.awards.draw.receivedP2 = userId
                result.save()
                User.findOne({_id: userId})
                  .populate({path: 'arenas', match: {_id: arenaId}})
                  .exec(function (err, user) {
                    if (err) {
                      return res.status(500).json({
                        message: 'Unexpected Error',
                        error: err

                      })
                    }
                    user.arenas.pull({_id: arenaId})
                    user.save(function (err, saveres) {
                      if (err) {
                        return res.status(500).json({
                          where: 'Awards',
                          message: 'Unexpected error',
                          err: err
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
                          if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                            || result.awards.winner.received == true && result.awards.loser.received == true) {
                            arena.remove(function (err, arenaresult) {
                              if (err) {
                                return res.status(500).json({
                                  where: 'Awards',
                                  message: 'Unexpected error',
                                  error: err
                                })
                              }
                              if (arenaresult) {
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
                          } else {
                            return res.status(200).json({
                              message: 'All updated'
                            })
                          }
                        })
                    })
                  })
              } else {
                return res.status(500).json({
                  where: 'Awards',
                  message: 'Unexpected error',
                  error: err

                })
              }
            }
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
}

