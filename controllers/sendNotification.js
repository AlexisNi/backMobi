/**
 * Created by alexn on 11/06/2017.
 */
var admin = require('firebase-admin')
var DeviceToken = require('../models/deviceTokens')
var Arenas = require('../models/arena')

module.exports = function (otherUserId, user, arenaId) {
  Arenas.findOne({_id: arenaId})
    .exec(function (err, result) {
      if (err) {
        throw err
      }
      if (result) {
        if (result.userOneSendNotification != null) {
          if (result.userOneSendNotification.userId == user && result.userOneSendNotification.send == false) {
            DeviceToken.findOne({userId: otherUserId})
              .exec(function (err, device) {
                if (err) {
                  throw err
                }
                console.log(result)
                if (device) {
                  try {
                    var registrationToken = device.token
                    var payload = {
                      notification: {
                        title: 'You have a new Notification',
                        body: 'A player has just inivte you, challenge him!!',
                        sound: 'default'
                      }
                    }
                    admin.messaging().sendToDevice(registrationToken, payload)
                      .then(function (response) {
                        result.userOneSendNotification.send = true
                        result.save()
                        console.log('Successfully sent message:', response)
                      })
                      .catch(function (error) {
                        console.log('Error sending message:', error)
                      })
                  } catch (err) {

                  }
                }

              })
          }

        }
        if (result.userTwoSendNotification != null) {
        if (result.userTwoSendNotification.userId == user && result.userTwoSendNotification.send == false) {
          DeviceToken.findOne({userId: otherUserId})
            .exec(function (err, device) {
              console.log(device);
              if (err) {
                console.log(err)
                throw err
              }
              if (device) {
                try {
                  var registrationToken = device.token
                  var payload = {
                    notification: {
                      title: 'You have a new Notification',
                      body: 'A player has just finished playing ,login to receive you reward!',
                      sound: 'default'
                    }
                  }
                  admin.messaging().sendToDevice(registrationToken, payload)
                    .then(function (response) {
                      result.userTwoSendNotification.send = true
                      result.save()
                      console.log('Successfully sent message:', response)
                    })
                    .catch(function (error) {
                      console.log('Error sending message:', error)
                    })
                } catch (err) {

                }
              }

            })

        }
      }
      }

    })

}