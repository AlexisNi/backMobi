/**
 * Created by alexn on 31/05/2017.
 */
var User = require('../models/user');
var Statistics=require('../models/statistics');

exports.userCheck = function (req, res, next) {
  var userId = req.body.uid;

  try {
    console.log('inside')
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
            username: user.userName
          })
        } else {
          return res.status(404).json({
            message: 'User has no profile'
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
                  message: 'UserName already exists please try another one'
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
