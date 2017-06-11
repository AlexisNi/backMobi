/**
 * Created by alexn on 10/06/2017.
 */
var DeviceToken = require('../models/deviceTokens')
var User = require('../models/user')
var admin = require('firebase-admin')
exports.saveTokenDevice = function (req, res, next) {
  var registrationToken = req.body.devToken
  var userId = req.body.userId
  DeviceToken.findOne({token: registrationToken})
    .exec(function (err, result) {
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
          userId: userId,
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
          User.findOne({_id: userId})
            .exec(function (err, user) {
              if (err) {
                return res.status(500).json({
                  title: 'Error',
                  message: 'An error has occured....',
                  status: '500',
                  err: err
                })
              }

              user.deviceToken.push(result)
              user.save(function (err, userSaved) {
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
                })
              })
            })
        })
      }
    })

  /*  var payload = {
   notification: {
   title: "$GOOG up 1.43% on the day",
   body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
   }
   };

   admin.messaging().sendToDevice(registrationToken, payload)
   .then(function(response) {
   console.log("Successfully sent message:", response);
   return res.status(200).json({
   message:'Success Message send'
   })
   })
   .catch(function(error) {
   console.log("Error sending message:", error);
   });*/
}