var express = require('express')
var ArenaUser = require('../models/arena')
var User = require('../models/user')
var Questions = require('../models/questions')

exports.createArena = function (req, res, next) {
  try {
    User.findById(req.body.userId, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'Error',
          message: 'An error has occured....',
          status: '500'
        })
      }
      User.findById(req.body.inviteId, function (err, userInvite) {
        console.log(userInvite);
        if (err) {
          return res.status(500).json({
            title: 'Error',
            message: 'An error has occured....',
            status: '500'
          })
        }
     /*     Questions.syncRandom(function (err, result) {
         if(err){
         console.log(err);
         }
         console.log(result);
         });*/
        var level1 = {level: 1}
        var level2 = {level: 2}
        var level3 = {level: 3}
        var level4 = {level: 4}
        var level5 = {level: 5}
        var questionsArray = []
        Questions.findRandom(level1).limit(1).exec(function (err, level1) {
          if (err) {
            return res.status(500).json({
              title: 'An error occured',
              error: err
            })
          }
          for (var i = 0; i < level1.length; i++) {
            questionsArray.push(level1[i])
          }
          Questions.findRandom(level2).limit(1).exec(function (err, level2) {
            if (err) {
              return res.status(500).json({
                title: 'An error occured',
                error: err
              })
            }
            for (var i = 0; i < level2.length; i++) {
              questionsArray.push(level2[i])
            }

            Questions.findRandom(level3).limit(2).exec(function (err, level3) {
              if (err) {
                return res.status(500).json({
                  title: 'An error occured',
                  error: err
                })
              }
              for (var i = 0; i < level3.length; i++) {
                questionsArray.push(level3[i])
              }

              Questions.findRandom(level4).limit(4).exec(function (err, level4) {
                if (err) {
                  return res.status(500).json({
                    title: 'An error occured',
                    error: err
                  })
                }
                for (var i = 0; i < level4.length; i++) {
                  questionsArray.push(level4[i])
                }

                Questions.findRandom(level5).limit(2).exec(function (err, level5) {
                  if (err) {
                    return res.status(500).json({
                      title: 'An error occured',
                      error: err
                    })
                  }
                  for (var i = 0; i < level5.length; i++) {
                    questionsArray.push(level5[i])
                  }

                  ArenaUser.schema.eachPath(function (path) {
                  });
                  var arenaUser = new ArenaUser({
                    user: user,
                    invite: userInvite,
                    status_accept: false,
                    questions: questionsArray,
                    userOneSendNotification:{userId:user},
                    userTwoSendNotification:{userId:userInvite}
                  })

                  arenaUser.save(function (err, result) {
                    console.log(result);
                    try {
                      if (err) {
                        return res.status(500).json({
                          title: 'Error',
                          message: 'You already playing with that user ',
                          status: '500'
                        })
                      }
                      user.arenas.push(result);
                      user.save();
                      userInvite.arenas.push(result);
                      userInvite.save();

                      return res.status(201).json({
                        message: 'Saved Message',
                        obj: result,
                      })
                    } catch (err) {
                      return res.status(500).json({
                        where: 'Create arenas',
                        title: 'An error occured ',
                        message: 'Arena already exist',
                        status: '500'
                      })
                    }
                  })
                })
              })
            })
          })
        })
      })
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      where: 'Create arenas',
      title: 'Arena already exist or Unknow error',
      message: 'An error occured',
      status: '500'
    })

  }
}
exports.statusPlayed = function (req, res, next) {
  console.log('Post Received played status')
  console.log(req.body)
  var userId = req.body.userId
  var arenaId = req.body.arenaId
  ArenaUser.findOne({_id: arenaId})
    .populate('user')
    .populate('invite')
    .exec(function (err, arenas) {
      try {
        if (arenas.user._id == userId) {
          try {
            ArenaUser.update({_id: arenaId}, {$set: {user_played: true}}, function (err, result) {
              if (err) {
                return res.status(500).json({
                  title: 'An error occurred',
                  error: err
                })
              }
              return res.status(200).json({
                message: 'success',
              })
            })
          } catch (err) {
            return res.status(500).json({
              where: 'Status Play',
              title: 'Error',
              message: 'An error has occured....',
              status: '500'
            })
          }
        } else {
          try {
            ArenaUser.update({_id: arenaId}, {$set: {invite_played: true}}, function (err, result) {
              if (err) {
                return res.status(500).json({
                  title: 'Error',
                  message: 'An error has occured....',
                  status: '500'
                })
              }
              return res.status(200).json({
                message: 'success'
              })
            })
          } catch (err) {
            return res.status(500).json({
              title: 'Error',
              message: 'An error has occured....',
              status: '500'
            })
          }
        }

      } catch (err) {
        return res.status(500).json({
          where: 'Status Play',
          title: 'Error',
          message: 'An error has occured....',
          status: '500'
        })

      }
    })

}

exports.getResult = function (req, res, next) {
  try {
    var arenaId = req.body.arenaId
    var userId = req.body.userId

  }
  catch (err) {
    return res.status(500).json({
      title: 'Error',
      message: 'An error has occured....',
      status: '500'
    })
  }

}