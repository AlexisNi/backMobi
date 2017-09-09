var ArenaQuestions = require('../../models/activeArena')
var ArenaUser = require('../../models/arena')
var Awards = require('../../models/awards')
var Statistics = require('../../models/statistics')
var User = require('../../models/user')
var level
var experience
var HistoryLogs = require('../../models/history');

exports.statisticsAddedWinner=function (req,res,next,userId,result,arenaId) {
  return new Promise(function (resolve, reject) {
    Statistics.findOne({user: userId}).exec(function (err, statistics) {
      if (err) {
        reject({error:err,message:'CouldNot get award',where:'14-statisticsAddedWinner'});

      }

      try {
        statistics.currentExp = statistics.currentExp + result.awards.winner.experience
        statistics.wins = statistics.wins + 1
        var levelInfo = require('.././LevelUp')(statistics.level, statistics.currentExp)
        statistics.currentExp = levelInfo.currentExperience
        statistics.level = levelInfo.level
        statistics.save(function (err, statsResult) {
          var loserId = result.awards.loser.userId
          require('.././historicData').historicWinner(req, res, next, userId, loserId).then(function (history) {

            require('.././last5Matches').update5Matches(req, res, next, userId, loserId, 'W').then(function (matches) {

              User.findOne({_id: userId})
                .populate({path: 'arenas', match: {_id: arenaId}})
                .exec(function (err, user) {

                  if (err) {
                    reject({error:err,message:'CouldNot get award',where:'36-statisticsAddedWinner'});

                  }
                  try {

                    result.awards.winner.received = true
                    result.save()
                    user.last5Matches = matches
                    user.arenas.pull({_id: arenaId})
                    user.save(function (err, saveres) {
                      if (err) {
                        reject({error:err,message:'CouldNot get award',where:'47-statisticsAddedWinner userSave'});

                      }
                      ArenaUser.findOne({_id: arenaId})
                        .exec(function (err, arena) {
                          if (err) {
                            reject({error:err,message:'CouldNot get award',where:'54-statisticsAddedWinner ArenaUser'});

                          }
                          try {
                            if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP1.received == true
                              || result.awards.winner.received == true && result.awards.loser.received == true) {
                              ArenaQuestions.find({arenaId: arenaId})
                                .exec(function (err, ansResult) {
                                  if (err) {
                                  }
                                  if (ansResult) {
                                    for (var i = 0; i < ansResult.length; i++) {
                                      ansResult[i].remove()
                                    }
                                  }
                                })

                              arena.remove(function (err, resultArena) {
                                if (err) {
                                  reject({error:err,message:'CouldNot get award',where:'73-statisticsAddedWinner arenaremove'});

                                }
                                if (result) {
                                  result.remove(function (err, resultArena) {
                                    if (err) {
                                      reject({error:err,message:'CouldNot get award',where:'73-statisticsAddedWinner awardremove'});

                                    }
                                    resolve({message: 'Arena award remove'});


                                  })
                                }

                              })
                            }
                            else {
                              resolve({message: 'All saved'});


                            }
                          } catch (err) {
                            reject({error:err,message:'CouldNot get award',where:'statisticsAddedWinner first catch'});

                          }
                        })

                    })
                  } catch (err) {
                    reject({error:err,message:'CouldNot get award',where:'statisticsAddedWinner second catch'});

                  }
                })

            }).catch(function (err) {
              reject({error: err, message: 'CouldNot get award', where: 'Last 5 loser promise catch'});
            })
          }).catch(function (err) {
            reject({error: err, message: 'CouldNot get award', where: 'HistoricData loser promise catch'});
          })
        })
      } catch (err) {
        reject({error:err,message:'CouldNot get award',where:'statisticsAddedWinner third catch'});
      }

    })
  });

}


exports.statisticsAddedLoser=function (req,res,next,userId,result,arenaId) {
  return new Promise(function (resolve, reject) {

    Statistics.findOne({user: userId}).exec(function (err, statistics) {
      if (err) {
        reject({error: err, message: 'Couldnt save award', where: '90-staticsAddedLoser'});
      }
      statistics.currentExp = statistics.currentExp + result.awards.loser.experience;
      statistics.loses = statistics.loses + 1;
      var levelInfo = require('.././LevelUp')(statistics.level, statistics.currentExp);
      statistics.currentExp = levelInfo.currentExperience;
      statistics.level = levelInfo.level;
      statistics.save(function (err, loserUser) {
        var winnerdId = result.awards.winner.userId;

        require('.././historicData').historicLoser(req, res, next, userId, winnerdId).then(function (history) {
          require('.././last5Matches').update5Matches(req, res, next, userId, winnerdId, 'L').then(function (matches) {

            User.findOne({_id: userId})
              .populate({path: 'arenas', match: {_id: arenaId}})
              .exec(function (err, user) {
                if (err) {
                  reject({error: err, message: 'Couldnt save award', where: '107-staticsAddedLoser'});
                }
                result.awards.loser.received = true
                result.save();
                user.last5Matches = matches
                user.arenas.pull({_id: arenaId})
                user.save(function (err, saveres) {
                  if (err) {
                    reject({error: err, message: 'Couldnt save award', where: '115-staticsAddedLoser'});
                  }
                  ArenaUser.findOne({_id: arenaId})
                    .exec(function (err, arena) {
                      if (err) {
                        reject({error: err, message: 'Couldnt save award', where: '120-staticsAddedLoser'});
                      }
                      if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP1.received == true
                        || result.awards.winner.received == true && result.awards.loser.received == true) {
                        ArenaQuestions.find({arenaId: arenaId})
                          .exec(function (err, ansResult) {
                            if (err) {
                              reject({error: err, message: 'Couldnt save award', where: '127-staticsAddedLoser'});
                            }
                            if (ansResult) {
                              for (var i = 0; i < ansResult.length; i++) {
                                ansResult[i].remove()
                              }
                            }
                          });

                        arena.remove(function (err, Arenaresult) {
                          if (err) {
                            reject({error: err, message: 'Couldnt save award', where: '138-staticsAddedLoser'});
                          }
                          if (Arenaresult) {
                            result.remove(function (err, resu) {
                              if (err) {
                                reject({error: err, message: 'Couldnt save award', where: '143-staticsAddedLoser'});
                              }
                              resolve({message: 'arena and award removed'});
                            })
                          }
                        })
                      }
                      else {
                        resolve({message: 'All saved'});
                      }
                    })
                })
              })
          }).catch(function (err) {
            reject({error: err, message: 'CouldNot get award', where: 'Last 5 loser promise catch'});

          })
        }).catch(function (err) {
          reject({error: err, message: 'CouldNot get award', where: 'HistoricData loser promise catch'});

        })

      })
    })
  });
}

exports.statisticsAddedDraw=function (req,res,next,userId,result,arenaId) {
  console.log('ARENA ID ',arenaId);
  return new Promise(function (resolve, reject) {

    Statistics.findOne({user: userId}).exec(function (err, statistics) {
      if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP2.userId == userId) {
        reject({error: 'award received', message: 'Award aleady received', where: 'Award draw'});
      } else if (result.awards.draw.receivedP1.received == true && result.awards.draw.receivedP1.userId == userId) {
        reject({error: 'award received', message: 'Award aleady received', where: 'Award draw'});

      } else {
        statistics.currentExp = statistics.currentExp + result.awards.draw.experience
        statistics.points = statistics.points + 1
        statistics.draws = statistics.draws + 1
        var levelInfo = require('.././LevelUp')(statistics.level, statistics.currentExp)
        statistics.currentExp = levelInfo.currentExperience
        statistics.level = levelInfo.level
        statistics.save(function (err, statisticDrawResultP1) {
          if (err) {
            reject({error: err, message: 'Couldnt get award', where: '193-statisticsAddedDraw save'});
          }
          if (result.awards.draw.receivedP1.received == false && result.awards.draw.receivedP1.userId == userId) {
            var otherId = result.awards.draw.receivedP2.userId
            result.awards.draw.receivedP1.received = true
            result.save(function (err, resultSaveHistory) {
              if (err) {
                reject({error: err, message: 'Couldnt get award', where: '201-statisticsAddedDraw save'});

              }
            })

            require('.././historicData').historicDraw(req, res, next, userId, otherId, result).then(function (history) {
              require('.././last5Matches').update5Matches(req, res, next, userId, otherId, 'D').then(function (matches) {

                User.findOne({_id: userId})
                  .populate({path: 'arenas', match: {_id: arenaId}})
                  .exec(function (err, user) {
                    if (err) {
                      reject({error: err, message: 'Couldnt get award', where: '212-statisticsAddedDraw.inside histroy-last5'});
                    }
                    user.last5Matches = matches
                    user.arenas.pull({_id: arenaId})
                    user.save(function (err, saveres) {
                      if (err) {
                        reject({error: err, message: 'Couldnt get award', where: '218-statisticsAddedDraw.inside userSave'});
                      }
                      ArenaUser.findOne({_id: arenaId})
                        .exec(function (err, arena) {
                          if (err) {
                            reject({error: err, message: 'Couldnt get award', where: '223-statisticsAddedDraw.inside ArenaUser'});
                          }
                          if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP1.received == true
                            || result.awards.winner.received == true && result.awards.loser.received == true) {
                            ArenaQuestions.find({arenaId: arenaId})
                              .exec(function (err, ansResult) {
                                if (err) {
                                  reject({error: err, message: 'Couldnt get award', where: '230-statisticsAddedDraw.inside ArenaQuestions'});
                                }
                                if (ansResult) {
                                  for (var i = 0; i < ansResult.length; i++) {
                                    ansResult[i].remove()
                                  }
                                }
                              })

                            arena.remove(function (err, arenaresult) {
                              if (err) {
                                reject({error: err, message: 'Couldnt get award', where: '242-statisticsAddedDraw.inside arenaRemove'});

                              }
                              if (arenaresult) {
                                result.remove(function (err, resu) {
                                  if (err) {
                                    reject({error: err, message: 'Couldnt get award', where: '248-statisticsAddedDraw.inside award remove'});

                                  }
                                  resolve({message: 'arena and award removed'});


                                })
                              }
                            })
                          } else {

                            resolve({message: 'All saved'});
                          }
                        })
                    })
                  })
              }).catch(function (err) {
                reject({error: err, message: 'CouldNot get award', where: 'last5matches1 draw promise catch'});
              })
            }).catch(function (err) {
              reject({error: err, message: 'CouldNot get award', where: 'HistoricDataP1 draw promise catch'});
            })

          }
          else if (result.awards.draw.receivedP2.received == false && result.awards.draw.receivedP2.userId == userId) {
            var otherId = result.awards.draw.receivedP1.userId
            result.awards.draw.receivedP2.received = true
            result.save(function (err, resultSaveHistory) {
              if (err) {
                reject({error: err, message: 'Couldnt get award', where: '278-statisticsAddedDrawP2 save true'});
              }
            })
            require('.././historicData').historicDraw(req, res, next, userId, otherId, result).then(function (history) {
              require('.././last5Matches').update5Matches(req, res, next, userId, otherId, 'D').then(function (matches) {

                User.findOne({_id: userId})
                  .populate({path: 'arenas', match: {_id: arenaId}})
                  .exec(function (err, user) {
                    if (err) {
                      reject({error: err, message: 'Couldnt get award', where: '289-statisticsAddedDrawP2 findUser'});
                    }

                    user.last5Matches = matches
                    user.arenas.pull({_id: arenaId})
                    user.save(function (err, saveres) {
                      if (err) {
                        reject({error: err, message: 'Couldnt get award', where: '296-statisticsAddedDrawP2 userSave'});

                      }
                      ArenaUser.findOne({_id: arenaId})
                        .exec(function (err, arena) {
                          if (err) {
                            reject({error: err, message: 'Couldnt get award', where: '301-statisticsAddedDrawP2 arenaUser'});
                          }
                          if (result.awards.draw.receivedP2.received == true && result.awards.draw.receivedP1.received == true
                            || result.awards.winner.received == true && result.awards.loser.received == true) {
                            ArenaQuestions.find({arenaId: arenaId})
                              .exec(function (err, ansResult) {
                                if (err) {
                                  reject({error: err, message: 'Couldnt get award', where: '307-statisticsAddedDrawP2 ArenaQuestions'});
                                }
                                if (ansResult) {
                                  for (var i = 0; i < ansResult.length; i++) {
                                    ansResult[i].remove()
                                  }
                                }
                              })
                            arena.remove(function (err, arenaresult) {
                              if (err) {
                                reject({error: err, message: 'Couldnt get award', where: '321-statisticsAddedDrawP2 arenaRemove'});

                              }
                              if (arenaresult) {
                                result.remove(function (err, resu) {
                                  if (err) {
                                    reject({error: err, message: 'Couldnt get award', where: '328-statisticsAddedDrawP2 AwardRemove'});

                                  }
                                  resolve({message: 'arena and award removed'});

                                })
                              }
                            })
                          } else {
                            resolve({message: 'All saved'});

                          }
                        })
                    })
                  })
              }).catch(function (err) {
                reject({error: err, message: 'CouldNot get award', where: 'HistoricDataP2 draw promise catch'});
              })

            }).catch(function (err) {
              reject({error: err, message: 'CouldNot get award', where: 'HistoricDataP2 draw promise catch'});
            })
          } else {
            reject({error: 'Couldnt get award', message: 'Couldnt get award', where: '346-statisticsAddedDrawP2 last line'});

          }
        })

      }
    })
  });


  }
