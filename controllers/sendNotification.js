/**
 * Created by alexn on 11/06/2017.
 */
var admin = require('firebase-admin');
var DeviceToken = require('../models/deviceTokens');

module.exports=function (userId) {
  console.log('inside');

  DeviceToken.findOne({userId: userId})
    .exec(function (err,result) {
      if(err){
        return res.status(500).json({
          where: 'firebaseDevice',
          title: 'An error occured ',
          err:err
        })
      }
      console.log(result);
      if(result){
        try {
          var registrationToken = result.token;
          var payload = {
            notification: {
              title: "You have a new Notification",
              body: "You have a new Arena/Reward"
            }
          };
          admin.messaging().sendToDevice(registrationToken, payload)
            .then(function (response) {
              console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
              console.log("Error sending message:", error);
            });
        }catch (err){

        }
      }

    })
}
