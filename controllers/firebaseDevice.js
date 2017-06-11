/**
 * Created by alexn on 10/06/2017.
 */
var DeviceToken = require('../models/deviceTokens')
var User = require('../models/user')
exports.saveTokenDevice = function (req, res, next) {
  var registrationToken = req.body.devToken
  var userId = req.body.userId
  User.findById(userId, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: 'Error',
        message: 'An error has occured....',
        status: '500'
      })
    }
  DeviceToken.findOne({token: registrationToken})
    .exec(function (err, result) {
      if(err){
        return res.status(500).json({
          where: 'firebaseDevice',
          title: 'An error occured ',
          err:err
        })
      }
      if (result) {
        DeviceToken.update({_id: result._id}, {$set: {userId: userId}})
          .exec(function (err, result) {
            if (err) {
              return res.status(500).json({
                title: 'Error',
                message: 'An error has occured....',
                status: '500',
                err: err
              })

            }
            return res.status(201).json({
              message: 'Device Token Updated',
              obj: result
            })

          })

      } else {
        var devToken = new DeviceToken({
          userId: user,
          token: registrationToken
        })

        devToken.save(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'Error',
              message: 'An error has occured....',
              status: '500',
              err: err
            })
          }
          return res.status(201).json({
            message: 'Device Token saved',
            obj: userSaved
          });

        })
      }
    });
  });



}