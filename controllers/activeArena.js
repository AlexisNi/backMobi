/**
 * Created by alex on 02/03/2017.
 */
var ArenaQuestions = require('../models/activeArena')
var Awards = require('../models/awards')
var User = require('../models/user')
var Arenas = require('../models/arena')

exports.saveAnsweredQuestion = function (req, res, next) {
  var arenaId=req.body.arenaId;
  var userId=req.body.userId;
  try {
    ArenaQuestions.findOne({$and: [{arenaId: req.body.arenaId}, {userId: req.body.userId}]})
      .exec(function (err, arenaQuestion) {
        if (arenaQuestion) {
          try {
            ArenaQuestions.update({_id: arenaQuestion._id}, {$push: {questionAnswer: req.body.question}}, function (err, result) {
              if (err) {
                return res.status(500).json({
                  title: 'Error',
                  message: 'An error has occured....',
                  status: '500'
                })
              }
              res.status(201).json({
                message: 'QuestionAnswer created',
                obj: result
              })

            })
          } catch (err) {
            if (err) {
              return res.status(500).json({
                where: 'Save Answer',
                title: 'Error',
                message: 'An error has occured unable to save answerd question....',
                status: '500'
              })
            }
          }

        } else {
          try {
            var arenaQuestion = new ArenaQuestions({
              arenaId: req.body.arenaId,
              userId: req.body.userId,
              questionAnswer: req.body.question

            })
            arenaQuestion.save(function (err, result) {
              if (err) {
                return res.status(500).json({
                  title: 'Error',
                  message: 'An error has occured....',
                  status: '500'
                })
              }
              if(result){
                Arenas.findOne({_id: arenaId})
                  .exec(function (err,arenasFound) {
                      if(err){

                      }
                      if(arenasFound){
                        if(arenasFound.user==userId){
                          arenasFound.questionsAnswered.user.questionNumber=result;
                          arenasFound.save();

                        }else{
                          arenasFound.questionsAnswered.invite.questionNumber=result;
                          arenasFound.save();

                        }
                      }

                  })

              }
              res.status(201).json({
                message: 'QuestionSaved created',
                obj: result
              })
            })
          } catch (err) {
            if (err) {
              return res.status(500).json({
                where: 'Save Answer',
                title: 'Error',
                message: 'An error has occured unable to save answerd question....',
                status: '500'
              })
            }
          }

        }
      })
  } catch (err) {
    if (err) {
      return res.status(500).json({
        where: 'Save Answer',
        title: 'Error',
        message: 'Error:Unable to save answerd question....',
        status: '500'
      })
    }

  }
}
exports.getQuestions = function (req, res, next) {
  var arenaId = req.body.arenaId
  try {
    Arenas.findOne({_id: arenaId})
      .exec(function (err, arena) {
        try {

          if (err) {
            return res.status(500).json({
              title: 'An error occured',
              error: err
            })
          }
          if (req.body.userId == arena.user) {
            if (arena.user_played == true) {
              return res.status(500).json({
                title: 'You already played',
              })
            } else {
              Arenas.findOne({_id: arenaId})
                .populate('questions')
                .exec(function (err, questions) {
                  try {
                    if (err) {
                      return res.status(500).json({
                        title: 'An error occured',
                        error: err
                      })
                    }
                    return res.status(200).json({
                      message: 'Questions received',
                      questions: questions.questions,
                    })
                  } catch (err) {
                    return res.status(500).json({
                      where: 'Receive Qeustions',
                      title: 'Unable to load Questions',
                      error: err
                    })
                  }
                })

            }
          }
          try {
            if (req.body.userId == arena.invite) {
              if (arena.invite_played == true) {
                return res.status(500).json({
                  title: 'You already played',
                })
              } else {
                Arenas.findOne({_id: arenaId})
                  .populate('questions')
                  .exec(function (err, questions) {
                    try {
                      if (err) {
                        return res.status(500).json({
                          title: 'An error occured',
                          error: err
                        })
                      }
                      return res.status(200).json({
                        message: 'Questions received',
                        questions: questions.questions,
                      })
                    } catch (err) {
                      return res.status(500).json({
                        where: 'Receive questions',
                        title: 'Unable to load Questions',
                        error: err
                      })
                    }
                  })
              }

            }
          } catch (err) {
            return res.status(500).json({
              where: 'Receive questions',
              title: 'Unable to get questions',
              error: err
            })

          }

        } catch (err) {
          return res.status(500).json({
            where: 'Receive questions',
            title: 'Unable to get questions',
            error: err
          })

        }

      })
  } catch (err) {
    return res.status(500).json({
      where: 'Receive Qeustion',
      title: 'Unable to get questions',
      error: err
    })
  }

}
exports.getCorrectNumber = function (req, res, next) {
  var arenaId = req.body.arenaId
  var userId = req.body.userId
  try {
    ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: userId}]})
      .populate('userId', 'useName')
      .exec(function (err, answerCount) {
        try {
          if (err) {
            return res.status(500).json({
              title: 'An error occured',
              message: 'Error in getting correct answers',
              error: err
            })
          }
          if (answerCount != null) {
            return res.status(200).json({
              message: 'Correct',
              correct: answerCount.questionAnswer.length ,
            })

          } else {

            return res.status(200).json({
              message: 'Correct',
              correct: 0,
            })
          }
        } catch (err) {
          return res.status(500).json({
            where: 'Result',
            title: 'Unable to get correct answers number',
            message: 'Error in getting correct answers',

            error: err
          })
        }

      })
  } catch (err) {
    return res.status(500).json({
      where: 'Result',
      message: 'Error in getting correct answers',

      title: 'Unable to get correct answers number',
      error: err
    })
  }
}
exports.getResults = function (req, res, next) {
  var arenaId = req.body.arenaId
  var userId= req.body.userId;

  Awards.findOne({arenaId: arenaId})
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          where: 'getResults',
          message: 'Error in getting award',
          error: err
        })
      } else {
        if (result) {
          var awardToReturn;
          if(result.awards.draw.receivedP1.userId==userId){
            awardToReturn=result.awards.draw.receivedP1;
          }else{
            awardToReturn=result.awards.draw.receivedP2;
          }
          if(result.draw==true) {
            return res.status(200).json({
              message: 'ΤΟ ΠΑΙΧΝΙΔΙ ΕΛΗΞΕ ΙΣΟΠΑΛΙΑ!',
              draw: true,
              awards: awardToReturn,
              isWin:false,
              otherPlayerCorrect:awardToReturn.correctAnswers,
              myResult:awardToReturn.correctAnswers


            })
          }else{
            var awardToReturn;
            var otherPlayerCorrect;
            var isWin;
            let message='';
            let myResult;
            if(result.awards.winner.userId==userId){
              awardToReturn=result.awards.winner;
              otherPlayerCorrect=result.awards.loser.correctAnswers;
              myResult=result.awards.winner.correctAnswers;
              isWin=true;
              message='ΣΥΓΧΑΡΗΤΗΡΙΑ KEΡΔΙΣΕΣ!'
            }else{
              awardToReturn=result.awards.loser;
              otherPlayerCorrect=result.awards.winner.correctAnswers;
              myResult=result.awards.loser.correctAnswers;
              isWin=false;
              message='ΔΥΣΤΗΧΩΣ ΕΧΑΣΕΣ!'
            }
            return res.status(200).json({
              message: message,
              draw: false,
              awards: awardToReturn,
              otherPlayerCorrect:otherPlayerCorrect,
              myResult:myResult,
              isWin:isWin
            })

          }


        }
      }

    })

  /*  var arenaId = req.body.arenaId
   var userId = req.body.userId;
   try {
   ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: userId}]})
   .populate('userId', 'userName')
   .exec(function (err, answerCount) {
   if (err) {
   return res.status(500).json({
   title: 'An error occured',
   error: err,
   message: 'Error in getting correct answers'
   })
   }


   ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: {$ne: userId}}]})
   .populate('userId', 'userName')
   .exec(function (err, answerCountB) {
   if (err) {
   return res.status(500).json({
   title: 'An error occured',
   error: err,
   message: 'Error in getting correct answers'

   })
   }

   try {
   if (answerCount.questionAnswer.length > answerCountB.questionAnswer.length) {
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

   Awards.findOne({arenaId: arenaId}).exec(function (err, getAwards) {
   if (!getAwards) {
   awards = new Awards({
   arenaId: arenaId, awards: {
   arenaId: arenaId, winner: {
   userId: answerCount.userId._id, points: 3, experience: 140
   }, loser: {
   userId: answerCountB.userId._id, points: 0, experience: 40
   }
   }
   })
   awards.save()

   } else {
   awards = getAwards

   }

   return res.status(200).json({
   message: 'success',
   winner: answerCount.userId,
   loser: answerCountB.userId,
   awards: awards,
   draw: false

   })

   })
   } catch (err) {
   return res.status(500).json({
   where: 'Result',
   title: 'An error occured',
   error: err,
   message: 'Error in getting correct answers'

   })
   }

   } else if (answerCount.questionAnswer.length < answerCountB.questionAnswer.length) {
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

   Awards.findOne({arenaId: arenaId}).exec(function (err, getAwards) {
   if (!getAwards) {
   awards = new Awards({
   arenaId: arenaId, awards: {
   arenaId: arenaId, winner: {
   userId: answerCountB.userId._id, points: 3, experience: 140
   }, loser: {
   userId: answerCount.userId._id, points: 0, experience: 40
   }
   }
   })
   awards.save()

   } else {
   awards = getAwards

   }
   return res.status(200).json({
   message: 'success',
   loser: answerCount.userId,
   winner: answerCountB.userId,
   awards: awards,
   draw: false

   })

   })
   } catch (err) {
   return res.status(500).json({
   where: 'Result',
   title: 'An error occured',
   where: 'get results',
   error: err
   })
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

   Awards.findOne({arenaId: arenaId}).exec(function (err, getAwards) {
   if (!getAwards) {
   awards = new Awards({
   arenaId: arenaId, awards: {
   arenaId: arenaId, draw: {
   userId: answerCountB.userId._id, points: 1, experience: 70,
   receivedP1: {
   userId: answerCount.userId._id,
   points:1,
   experience:70

   },
   receivedP2: {
   userId:answerCountB.userId._id,
   points:1,
   experience:70

   }
   }
   }
   })
   awards.save(function (err,result) {
   if(err){
   console.log(err)
   }

   })

   } else {
   awards = getAwards

   }
   return res.status(200).json({
   message: 'success',
   winner: '',
   loser: ' ',
   draw: true,
   awards: awards

   })

   })
   } catch (err) {
   return res.status(500).json({
   where: 'Results',
   title: 'An error occured',
   error: err
   })
   }
   }
   } catch (err) {
   return res.status(500).json({
   where: 'Results',
   title: 'An error occured',
   error: err
   })

   }


   })
   })
   } catch (err) {
   return res.status(500).json({
   where: 'Results',
   title: 'Unable to get Results',
   error: err
   })
   }*/

}