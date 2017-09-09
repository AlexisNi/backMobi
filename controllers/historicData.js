var User = require('../models/user')
var HistoryLogs = require('../models/history')

exports.getHistoricDataVsOpponent = function (req, res, next) {
  var userId = req.body.userId
  var opponentId = req.body.opponentId
  var historicData = {}

  User.findOne({_id: userId}).populate('history', null, {opponentId: opponentId}).exec(function (err, historyFound) {
    if (err) {
      return res.status(500).json({
        message: 'Unexpected Error'
      })
    }
    if (historyFound) {
      if (historyFound.history.length < 1) {
        historicData.wins = 0
        historicData.loses = 0
        historicData.draws = 0
      } else {
        historicData = historyFound.history[0]
      }
      return res.status(200).json({
        message: 'History Found',
        history: historicData
      })
    }

  })
}

exports.historicWinner = function (req, res, next, userId, loserId) {
  return new Promise(function (resolve, reject) {

    User.findOne({_id: userId}).exec(function (err, winnerUser) {
      if (err) {
        reject({error:err,message:'Couldnt save award',where:'37-historicWinner'});

      }
      if (winnerUser) {
        HistoryLogs.findOne({$and: [{userId: userId, opponentId: loserId}]}).exec(function (err, history) {
          if (err) {
            reject({error:err,message:'Couldnt save award',where:'43-historiWinner.logs'});

          }
          if (history == undefined || history == null) {
            var newHistory = new HistoryLogs({
              userId: userId,
              opponentId: loserId,
              loses: 0,
              draws: 0,
              wins: 1
            })
            newHistory.save(function (err, historyRes) {
              if (err) {
                reject({error:err,message:'Couldnt save award',where:'56-historiWinner.hisotrysave'});
              } else {
                winnerUser.history.push(historyRes);
                winnerUser.save(function (err, reHistory) {
                  if (err) {
                    reject({error:err,message:'Couldnt save award',where:'61-historiWinner.hisotrysave'});

                  } else {
                    resolve('Saved New Hisotry')
                  }
                })

              }
            })

          } else {
            history.wins = history.wins + 1
            history.save(function (err, reHistory) {
              if (err) {
                reject({error:err,message:'Couldnt save award',where:'75-historiWinner.75'});

              } else {
                resolve('History updated')
              }
            })
          }
        })
      }

    })
  })

}

exports.historicLoser = function (req, res, next, userId, winnerId) {
  return new Promise(function (resolve, reject) {

    User.findOne({_id: userId}).exec(function (err, loserUser) {
      if (err) {
        reject({error:err,message:'Couldnt save award',where:'95-historiLoser'});

      }
      if (loserUser) {
        HistoryLogs.findOne({$and: [{userId: userId, opponentId: winnerId}]}).exec(function (err, history) {
          if (err) {
            reject({error:err,message:'Couldnt save award',where:'100-historiLoser.hisotrylogs'});

          }
          if (history == undefined || history == null) {
            var newHistory = new HistoryLogs({
              userId: userId,
              opponentId: winnerId,
              loses: 1,
              draws: 0,
              wins: 0
            })
            newHistory.save(function (err, historyRes) {
              if (err) {
                reject({error:err,message:'Couldnt save award',where:'114-historiLoser.newHisotry'});


              }
              loserUser.history.push(historyRes)
              loserUser.save(function (err, reHistory) {
                if (err) {
                  reject({error:err,message:'Couldnt save award',where:'121-historiLoser.newHisotry'});
                } else {
                  resolve('History updated')
                }
              })
            })

          } else {
            history.loses = history.loses + 1
            history.save(function (err, reHistory) {
              if (err) {
                reject({error:err,message:'Couldnt save award',where:'132-historiLoser.newHisotry'});

              } else {
                resolve(reHistory)
              }
            })

          }
        })
      }

    })
  })

}
exports.historicDraw = function (req, res, next, userId, otherId) {
  return new Promise(function (resolve, reject) {

    User.findOne({_id: userId}).exec(function (err, user) {
      if (err) {
        reject(err)
      }
      if (user) {
        HistoryLogs.findOne({$and: [{userId: userId, opponentId: otherId}]}).exec(function (err, history) {
          if (err) {
            reject(err)

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
              if (err) {
                reject(err)
              }
              user.history.push(historyRes)
        /*      user.save(function (err, reHistory) {
                if (err) {
                  reject({error:err,message:'Couldnt save award',where:'178-historidraw.newHisotry'});
                } else {
                  resolve('History updated')
                }
              })*/
            })

          } else {
            history.draws = history.draws + 1
            history.save(function (err, reHistory) {
              if (err) {
                reject({error:err,message:'Couldnt save award',where:'189-historidraw.newHisotry'});

              } else {
                resolve(reHistory)
              }
            })

          }
        })
      }

    })
  })

}