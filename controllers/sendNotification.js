/**
 * Created by alexn on 11/06/2017.
 */
var admin = require('firebase-admin');
var DeviceToken = require('../models/deviceTokens');
var Arenas = require('../models/arena')

module.exports=function (otherUserId,user,arenaId) {

  Arenas.findOne({_id:arenaId})
    .exec(function (err,result) {
      if(err){
        throw err;
      }
      if(result){
        if(result.userOneSendNotification!=null){
          if(result.userOneSendNotification.userId==user&&result.userOneSendNotification.send==false){
            DeviceToken.findOne({userId:otherUserId})
              .exec(function (err,result) {
                if(err){
                throw err;
                }
                console.log(result);
                if(result){
                  try {
                    var registrationToken = result.token;
                    var payload = {
                      notification: {
                        title: "You have a new Notification",
                        body: "You have a new Arena/Reward",
                        sound: "default"
                      }
                    };
                    admin.messaging().sendToDevice(registrationToken, payload)
                      .then(function (response) {
                        result.userOneSendNotification.send=true;
                        result.save();
                        console.log("Successfully sent message:", response);
                      })
                      .catch(function (error) {
                        console.log("Error sending message:", error);
                      });
                  }catch (err){

                  }
                }

              })
          }else{
            console.log('Notification has been sent')
          }

        }else if(result.userTwoSendNotification.userId==user&&result.userTwoSendNotification.send==false){

          DeviceToken.findOne({userId:otherUserId})
            .exec(function (err,result) {
              if(err){
              throw err;
              }
              console.log(result);
              if(result){
                try {
                  var registrationToken = result.token;
                  var payload = {
                    notification: {
                      title: "You have a new Notification",
                      body: "You have a new Arena/Reward",
                      sound: "default"
                    }
                  };
                  admin.messaging().sendToDevice(registrationToken, payload)
                    .then(function (response) {
                      result.userTwoSendNotification.send=true;
                      result.save();
                      console.log("Successfully sent message:", response);
                    })
                    .catch(function (error) {
                      console.log("Error sending message:", error);
                    });
                }catch (err){

                }
              }

            })

        }else{
          console.log('Notification has been sent')
        }

      }

    })




}
