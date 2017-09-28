/**
 * Created by alexn on 17/09/2017.
 */
var ArenaQuestions = require('../../models/activeArena')
var Awards = require('../../models/awards')

exports.awardCreate = function (userId, inviteId, arenaId) {
var awardCreatePromise=new Promise(function (resolve,reject) {
  var userOneLength;
  var userTwoLenth;
  var pointsA=0;
  var pointsB=0;
  var bonusPlayerA=0;
  var bonusPlayerB=0;
  try {
    ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: userId}]})
      .populate('userId', 'userName')
      .exec(function (err, answerCount) {
        if (err) {
          console.log(err)
        }
        else if (answerCount == null) {
          userOneLength = 0;
          bonusPlayerA=0;
        } else {
          userOneLength = answerCount.questionAnswer.length;
          for(var i=0; i<answerCount.questionAnswer.length;i++){
            if(answerCount.questionAnswer[i].time>25){
              bonusPlayerA=bonusPlayerA+0.05;
            }
            else if(answerCount.questionAnswer[i].time>20&&answerCount.questionAnswer[i].time<25){
              bonusPlayerA=bonusPlayerA+0.03

            }else{
              bonusPlayerA=bonusPlayerA+0;

            }
            pointsA=10+pointsA;


          }

        }
        ArenaQuestions.findOne().where({$and: [{arenaId: arenaId}, {userId: {$ne: userId}}]})
          .populate('userId', 'userName')
          .exec(function (err, answerCountB) {
            console.log('anwseer count b:',answerCountB)
            if (err) {
              console.log(err)
            }
            else if (answerCountB == null) {
              userTwoLenth = 0;
              bonusPlayerB=0;
            } else {
              try {
                userTwoLenth = answerCountB.questionAnswer.length;
                for (var i = 0; i < answerCountB.questionAnswer.length; i++) {
                  if (answerCountB.questionAnswer[i].time > 25) {
                    bonusPlayerB = bonusPlayerB + 0.05;
                  }
                  else if (answerCountB.questionAnswer[i].time > 20 && answerCountB.questionAnswer[i].time < 25) {
                    bonusPlayerB = bonusPlayerB + 0.03

                  } else {
                    bonusPlayerB = bonusPlayerB + 0;
                  }
                  pointsB = 10 + pointsB;

                }
              }catch (err){
                reject(err);
              }

            }
            try {
              if (userOneLength > userTwoLenth) {
                pointsA=pointsA+50;
                pointsA=(pointsA*bonusPlayerA)+pointsA;

                pointsB=pointsB+10;
                pointsB=(pointsB*bonusPlayerB)+pointsB;


                try {
                 var awards = new Awards({
                    arenaId: arenaId,
                    awards: {
                      winner: {
                        userId: userId,
                        points: pointsA,
                        experience: 140,
                        correctAnswers: userOneLength
                      }, loser: {
                        userId: inviteId,
                        points: pointsB,
                        experience: 40,
                        correctAnswers: userTwoLenth

                      }
                    }
                  })
                  awards.save(function (err,result) {
                    if(err){
                      reject(err);
                    }else{
                      resolve(arenaId);
                    }

                  })

                } catch (err) {
                  console.log(err);
                }

              } else if (userOneLength < userTwoLenth) {
                pointsA=pointsA+10;
                pointsA=(pointsA*bonusPlayerA)+pointsA;

                pointsB=pointsB+50;
                pointsB=(pointsB*bonusPlayerB)+pointsB;

                try {

                var  awards = new Awards({
                    arenaId: arenaId,
                    awards: {
                      winner: {
                        userId: inviteId,
                        points: pointsB,
                        experience: 140,
                        correctAnswers: userTwoLenth
                      }, loser: {
                        userId: userId,
                        points: pointsA,
                        experience: 40,
                        correctAnswers: userOneLength
                      }
                    }
                  })
                  awards.save(function (err,result) {
                    if(err){
                      reject(err);
                    }else{
                      resolve(arenaId);
                    }

                  })

                } catch (err) {
                  reject(err);
                }

              }

              else {
                pointsA=pointsA+20;
                pointsA=(pointsA*bonusPlayerA)+pointsA;

                pointsB=pointsB+20;
                pointsB=(pointsB*bonusPlayerB)+pointsB;
                try {
                      awards = new Awards({
                        draw:true,
                        arenaId: arenaId,
                        awards: {
                          arenaId: arenaId,
                          draw: {
                            receivedP1: {
                              userId: userId,
                              points: pointsA,
                              experience: 70,
                              correctAnswers: userOneLength
                            },
                            receivedP2: {
                              userId: inviteId,
                              points: pointsB,
                              experience: 70,
                              correctAnswers: userTwoLenth
                            }
                          }
                        }
                      })
                  awards.save(function (err,result) {
                    if(err){
                      reject(err);
                    }else{
                      resolve(arenaId);
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
})

  awardCreatePromise.then(function (arena) {
    ArenaQuestions.findOne({arenaId:arena})
      .exec(function (err,result) {
        if(err){
          console.log(err);
        }else if(result){
          result.remove();
        }
      })

  })

}