/**
 * Created by alexn on 10/06/2017.
 */
var User = require('../models/user')

var admin = require("firebase-admin");
exports.saveTokenDevice = function (req, res, next) {
  var registrationToken=req.body.devToken;
  var userId = req.body.uid;
/*  User.findOne({ $and: [{ firebaseId: userId }, { deviceToken: registrationToken }]})
    .exec(function (err,user) {
      if(err){
        return res.status(500).json({
          title: 'Error',
          message: 'Unexpected error',
          status: '500',
          err:err
        })
      }
      if(user){
        return res.status(200).json({
          title: 'Token exists',
          message: 'User device token has been saved before',
          err:err
        })
      }else{
        user.deviceToken.push(registrationToken);
        user.save(function (err,result) {
          if(err){
            return res.status(500).json({
              title: 'Error',
              message: 'Unexpected error',
              status: '500',
              err:err
            })
          }
          return res.status(200).json({
            title: 'Token has been saved',
            message: 'Token success!!',
            err:err
          })


        })
      }

    })*/
  var payload = {
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
    });
}