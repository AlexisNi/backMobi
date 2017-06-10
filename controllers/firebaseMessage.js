/**
 * Created by alexn on 10/06/2017.
 */

var admin = require("firebase-admin");
exports.saveTokenDevice = function (req, res, next) {
  var registrationToken=req.body.devToken;

  var payload = {
    data: {
      score: "850",
      time: "2:45"
    }
  };

  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}