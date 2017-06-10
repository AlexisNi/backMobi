/**
 * Created by alexn on 10/06/2017.
 */

var admin = require("firebase-admin");
exports.saveTokenDevice = function (req, res, next) {
  var registrationToken='c4fe4F3-7q0:APA91bEuNiTgilcC2B6c0zuYudEGnYqRVb8cBXtlVI5KnFb9SM7Cf9uGXapIT1XtSuwUAmzsicnOdlA4cfjH9YjPi7OUpwPlB8SJc7YWXkKJD5sSGLCbM2X8HizWCOP8tHIF1r7INILf '

  var payload = {
    data: {
      score: "850",
      time: "2:45"
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