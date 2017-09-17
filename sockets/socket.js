/**
 * Created by alex on 17/02/2017.
 */
var User = require('../models/user')
var jwt = require('jsonwebtoken')
var config = require('../config/auth')
var passport = require('passport')
var connectedUserList = []
var userInfo = []

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('user connected');
/*    User.find({}).exec(function (err,result) {
      if(err){

      }
      for(var i=0;i<result.length;i++){
          for(var j=0; j<result[i].arenas.length;j++){
           result[i].arenas[j]=[];
           console.log()


          }
        result[i].arenas=[]
        result[i].save();


      }


    })*/

    connectedUserList[socket.handshake.query.userId] = socket
    require('./updateStats')(socket, connectedUserList[socket.handshake.query.userId])

    socket.on('enterArena', function (req) {
      userInfo[socket.id] = req
      socket.join(req.arenaId)

    })
    socket.on('leaveArena', function () {
      var userData = userInfo[socket.id]
      if (typeof userData !== 'undefined') {
        socket.leave(userData.arenaId)
      }

    });

/*    socket.on('logout',function () {
      console.log('log out')
     socket.disconnect();
    })*/

    socket.on('sendArena', function (req) {
      console.log('send arena')
      require('./sendArena')(req, connectedUserList[req.userId])
    })

    socket.on('getArenas', function (req) {

        require('./getArenas')(req, connectedUserList[req.userId])


    })

    socket.on('getQuestions', function (req) {
      console.log('here get questions!')
      console.log(req)
      require('./getQuestion')(req, connectedUserList[req.userId])

    })
    socket.on('sendNotication', function (req) {
      console.log('NOTIFICATIONS')
      var userData = userInfo[socket.id]
      require('../controllers/sendNotification')(req.userId, userInfo[socket.id].userId, userInfo[socket.id].arenaId)

    });

    socket.on('disconnect', function () {
      console.log('User Disconcted')
      delete connectedUserList[socket.handshake.query.userId]

      var userData = userInfo[socket.id]
      if (typeof userData !== 'undefined') {
        socket.leave(userData.arenaId)
        var otherUser = userInfo[socket.id].inviteId
        require('../controllers/sendNotification')(otherUser, userInfo[socket.id].userId, userInfo[socket.id].arenaId)
        require('./updateUserStatus')(userInfo[socket.id].userId, userData.arenaId);
        if (connectedUserList[otherUser] != null) {
          if (otherUser != null) {
            console.log(otherUser);

            console.log('other user')
            require('./getArenasOnDisconnect')(otherUser, connectedUserList[otherUser],userData.arenaId)

          }

        }

        delete userInfo[socket.id];
        socket.disconnect(true)
      }
    })

  })
}

//8dc63f
//231f20