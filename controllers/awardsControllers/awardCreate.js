/**
 * Created by alexn on 17/09/2017.
 */
var ArenaQuestions = require('../../models/activeArena')
var Awards = require('../../models/awards')

exports.awardCreate = function (userId, inviteId, arenaId) {

  var arenaId = arenaId
  var userId = userId
  var userOneLength
  var userTwoLenth
  console.log('inside create award')

  try {
    ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: userId}]})
      .populate('userId', 'userName')
      .exec(function (err, answerCount) {
        if (err) {
          console.log(err)
        }
        else if (answerCount == null) {
          userOneLength = 0
        } else {
          userOneLength = answerCount.questionAnswer.length
        }
        ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: {$ne: userId}}]})
          .populate('userId', 'userName')
          .exec(function (err, answerCountB) {
            if (err) {
              console.log(err)
            }
            if (err) {
              console.log(err)
            }
            else if (answerCountB == null) {
              userTwoLenth = 0
            } else {
              userTwoLenth = answerCountB.questionAnswer.length
            }
            try {
              if (userOneLength > userTwoLenth) {
                try {
                  var awards = {
                    awards: {
                      arenaId: arenaId,
                      winner: {
                        userId: '',
                        arenaId: '',
                        points: 3,
                        experience: 140,
                        correctAnswers: userOneLength
                      }, loser: {
                        userId: '',
                        arenaId: '',
                        points: 0,
                        experience: 40,
                        correctAnswers: userTwoLenth
                      }
                    }
                  }
                  awards = new Awards({
                    arenaId: arenaId,
                    awards: {
                      winner: {
                        userId: answerCount.userId._id,
                        points: 3,
                        experience: 140,
                        correctAnswers: userOneLength
                      }, loser: {
                        userId: answerCountB.userId._id,
                        points: 0,
                        experience: 40,
                        correctAnswers: userTwoLenth

                      }
                    }
                  })
                  awards.save()

                } catch (err) {
                  console.log(err);
                }

              } else if (userOneLength < userTwoLenth) {
                try {
                  var awards = {
                    awards: {
                      arenaId: arenaId, winner: {
                        userId: '', arenaId: '', points: 3, experience: 140
                      }, loser: {
                        userId: '', arenaId: '', points: 0, experience: 40
                      }
                    }
                  }
                  awards = new Awards({
                    arenaId: arenaId,
                    awards: {
                      winner: {
                        userId: answerCountB.userId._id,
                        points: 3,
                        experience: 140,
                        correctAnswers: userTwoLenth
                      }, loser: {
                        userId: answerCount.userId._id,
                        points: 0,
                        experience: 40,
                        correctAnswers: userOneLength
                      }
                    }
                  })
                  awards.save()

                } catch (err) {
                console.log(err);
                }

              }

              else {
                try {
                  var awards = {
                    awards: {
                      arenaId: arenaId, winner: {
                        userId: '', arenaId: '', points: 3, experience: 140
                      }, loser: {
                        userId: '', arenaId: '', points: 0, experience: 40
                      }
                    }
                  }
                      awards = new Awards({
                        draw:true,
                        arenaId: arenaId,
                        awards: {
                          arenaId: arenaId,
                          draw: {
                            userId: answerCountB.userId._id,
                            points: 1,
                            experience: 70,
                            correctAnswers: userOneLength,
                            receivedP1: {
                              userId: answerCount.userId._id,
                              points: 1,
                              experience: 70
                            },
                            receivedP2: {
                              userId: answerCountB.userId._id,
                              points: 1,
                              experience: 70,
                              correctAnswers: userTwoLenth
                            }
                          }
                        }
                      })
                      awards.save(function (err, result) {
                        if (err) {
                          console.log(err)
                        }
                      })
                } catch (err) {
                  console.log(err);
                }
              }
            } catch (err) {
              console.log(err);
            }
          })
      })
  } catch (err) {
    console.log(err);
  }

}