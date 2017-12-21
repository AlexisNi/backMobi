/**
 * Created by alex on 17/02/2017.
 */
var User = require('../models/user')
var jwt = require('jsonwebtoken')
var config = require('../config/auth')
var passport = require('passport')
var connectedUserList = []
var userInfo = []
var Connections=require('../models/connections');
var Hints=require('../models/hints');

module.exports = function (io) {
  var mainGameNsp=io.of('/mainGame');
  var checkUserNsp=io.of('/checkIfUser');

  checkUserNsp.on('connection',function (socket) {
    socket.on('checkUser',function (userId) {
      if(connectedUserList[userId.userId]!=undefined){
        console.log('user is conected');
        socket.emit('connectedStatus',{connected:true});
      }else{
        console.log('user not connected')
        socket.emit('connectedStatus',{connected:false});
      }
    })
  })

  mainGameNsp.on('connection', function (socket) {
    console.log('user connected',socket.handshake.query.userId);
 socket.broadcast.emit('message', "this is a test");


    io.of('/mainGame').adapter.clients(function (err,clients) {


      console.log(clients);

    });



   /*     User.find({}).exec(function (err,result) {
          if(err){

          }
          result.map(async function (user) {
                var hint= new Hints({
                  userId:user
                })
            await hint.save(async function(err,res){
               user.hints=res;
               await user.save();

            });

          }






          for(var i=0;i<result.length;i++){
              for(var j=0; j<result[i].arenas.length;j++){
            result[i].arenas[j]=[];



          }
          result[i].arenas=[]
          result[i].save();






        }

        })*/

      if(connectedUserList[socket.handshake.query.userId]!==undefined){
        console.log('user is conected')


      }else{
       console.log('userConnected')
        connectedUserList[socket.handshake.query.userId] = socket;

      }

    require('./updateStats')(socket, connectedUserList[socket.handshake.query.userId]);
    require('../controllers/leaderboard').leaderBoardCreate();

    socket.on('enterArena', function (req) {
      userInfo[socket.id] = req
      socket.join(req.arenaId)

    })
    socket.on('leaveArena', function () {
      var userData = userInfo[socket.id]
      if (typeof userData !== 'undefined') {
        socket.leave(userData.arenaId)
        delete  userInfo[socket.id]
      }

    });


    socket.on('sendArena', function (req) {
      console.log('send arena')
      require('./sendArena')(req, connectedUserList[req.userId])
    })

    socket.on('getArenas', function (req) {

        require('./getArenas')(req, connectedUserList[req.userId])


    })

    socket.on('getQuestions', function (req) {
      console.log('here get questions!')

      require('./getQuestion')(req, connectedUserList[req.userId])

    })
    socket.on('sendNotication', function (req) {
      console.log('NOTIFICATIONS')
      require('../controllers/sendNotification')(req.inviteId, req.userId, req.arenaId);

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
            require('./getArenasOnDisconnect')(otherUser, connectedUserList[otherUser],userData.arenaId)

          }

        }

        delete userInfo[socket.id];
        socket.disconnect(true)
      }
    })

  })
}
