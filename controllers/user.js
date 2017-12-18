var User = require('../models/user')
var Statistics = require('../models/statistics')
var TU = require('../models/testUser');
var Hints=require('../models/hints');
exports.userCheck = function (req, res, next) {
  var userId = req.body.uid

  try {
    User.findOne({firebaseId: userId})
      .exec(function (error, user) {
        if (error) {
          return res.status(500).json({
            message: 'Unexpected error please login again...'
          })
        }
        if (user) {
          return res.status(200).json({
            message: 'User exist',
            user_id: user._id,
            username: user.username
          })
        } else {
          return res.status(404).json({
            message: 'User has no profile',
            error: 100
          })
        }
      })
  } catch (err) {
    return res.status(500).json({
      message: 'Unexpected error please login again...'
    })
  }
}
exports.userCreate = function (req, res, next) {
  var userId = req.body.firebase_id
  var userName = req.body.username

/*  var user=new TU({username:userName});
  user.save(function (error,user) {
    if(error){
      console.log(error);
      return res.status(500).json({
        message: 'Unexpected error please login again...'
      })
    }
    if(user){
      console.log(user);
    }

  });*/
 try {

    User.findOne({username: userName})
      .exec(function (error, user) {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Unexpected error please login again...'
          })
        }
        if (user) {
          return res.status(400).json({
            message: 'UserName already exists please try another one'
          })
        } else {
          var user = new User({
            firebaseId: userId,
            username: userName
          })
          user.save(function (err, result) {
            try {
              if (err) {

                if(err.errors.username.kind=='minlength'){
                  return res.status(400).json({
                    message: 'UserName must have more than 3 characters'
                  })
                }
               else if (err.errors.username.kind=='maxlength'){
                  return res.status(400).json({
                    message: 'UserName must have less than 10 characters'
                  })
                }
               else  if(err.errors.username.kind=='unique'){
                  return res.status(400).json({
                    message: 'UserName already exists please try another one'
                  })
                }else{
                  return res.status(400).json({
                    message: 'UserName couldn save'
                  })
                }
              }
              var statistics = new Statistics({
                user: result,
                firebase_id: userId
              });
              statistics.save(function (err, stats) {
                if (err) {

                  return res.status(500).json({
                    message: 'Unexpected error please login again...'
                  })
                }
                result.statistics = stats
                result.save()
              });
              var hints=new Hints({
                user:result
              })



              return res.status(200).json({
                message: 'User created',
                user_id: result._id,
                username: result.userName
              })
            } catch (err) {
              console.log(err);

              return res.status(500).json({
                message: 'Unexpected error please login again...'
              })

            }

          })

        }
      })
  } catch (err) {
    return res.status(500).json({
      message: 'Unexpected error please login again...'
    })
  }
}

exports.findUser = function (req, res, next) {
  var userName = req.body.username
  var userId= req.body.userId;
/*  User.findOne({username: new RegExp('^'+userName+'$', "i")}).exec(function (err,res) {
    if(err){
      console.log(err);
    }
    console.log(res);

  })*/

  try {
    User.findOne({username: new RegExp('^'+userName+'$', "i")})
      .populate('statistics')
      .populate({path:'history',match:{opponentId:userId}, options: { limit: 1 }} )
      .exec(function (err, user) {
        if (err) {
          return res.status(500).json({
            title: 'Error',
            message: 'An error has occured....',
            status: '500'
          })
        }


        if (user) {
          if (!user.statistics) {
            Statistics.findOne({user: user._id})
              .exec(function (err, result) {
                user.statistics = result
                user.save()
              })

          }

          if (user.firebaseId === req.body.uid) {
            return res.status(400).json({
              title: 'Self error',
              message: 'Sorry you cant play with your self',
              status: '400'
            })
          } else {
            return res.status(200).json({
              message: 'User Found',
              username: user.username,
              inviteId: user._id,
              statistics: user.statistics,
              history:user.history[0]
            })
          }
        }
        if (!user) {
          return res.status(400).json({
            title: 'No results',
            message: 'User Not Found',
            status: '400'
          })
        }

      })
  } catch (err) {
    return res.status(500).json({
      title: 'Error',
      message: 'An error has occured....',
      status: '500'
    })

  }

}
exports.findRandomUser = function (req, res, next) {
  var userId = req.body.userId
  var filter
  var arrayId = []
  User.findById(userId)
    .populate(
      {
        path: 'arenas'
      })
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Error',
          message: 'Could not find user',
          status: '500'
        })
      }

      if (result) {
        require('./findRandom').findRandomPlayer(req,res,next);
      }

    })

}
