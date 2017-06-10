var User = require('../models/user');
var Statistics=require('../models/statistics');

exports.userCheck = function (req, res, next) {
  var userId = req.body.uid;

  try {
    User.findOne({firebaseId: userId})
      .exec(function (error, user) {
        if (error) {
          console.log(error);
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
            error:100
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
  console.log(req.body)
  var userId = req.body.firebase_id;
  var userName = req.body.username
  try {
    User.findOne({username: userName})
      .exec(function (error, user) {
        if (error) {
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
          user.save(function (err, result ) {
            try {
              if (err) {
                console.log(err);
                return res.status(400).json({
                  message: 'UserName couldn save'
                })
              }
              var statistics = new Statistics({ user: result,firebase_id:userId });
              statistics.save(function (err,result) {
                if(err){
                  return res.status(500).json({
                    message: 'Unexpected error please login again...'
                  })
                }


              });



              return res.status(200).json({
                message: 'User created',
                user_id: result._id,
                username: result.userName
              })
            }catch (err){
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

exports.findUser=function (req,res,next) {
  var userName=req.body.username;
  try {
    User.findOne({username: userName}, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'Error',
          message: 'An error has occured....',
          status: '500'
        });
      }
      if(user){
        if(user.firebaseId===req.body.uid) {
          return res.status(400).json({
            title: 'Self error',
            message: 'Sorry you cant play with your self',
            status: '400'
          })
        }else {
          return res.status(200).json({
            message: 'User Found',
            userName: user.userName,
            inviteId: user._id
          });
        }
      }
      if (!user) {
        return res.status(400).json({
          title: 'No results',
          message: 'User Not Found',
          status: '400'
        });
      }

    });
  }catch (err){
    return res.status(500).json({
      title: 'Error',
      message: 'An error has occured....',
      status: '500'
    });

  }


}