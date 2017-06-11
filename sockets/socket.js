/**
 * Created by alex on 17/02/2017.
 */
var User = require('../models/user');
var jwt=require('jsonwebtoken');
var config = require('../config/auth');
var passport = require('passport');
var connectedUserList=[];
var userInfo=[];


module.exports = function (io) {
    io.on('connection',function (socket) {
        console.log('user connected');
        console.log(socket.handshake.query.userId);
        connectedUserList[socket.handshake.query.userId]=socket;
        require('./updateStats')(socket,connectedUserList[socket.handshake.query.userId]);



        socket.on('enterArena',function (req) {
            userInfo[socket.id]=req;
            socket.join(req.arenaId);
            console.log('player entered arena with detals :'+ userInfo[socket.id].arenaId+' '+userInfo[socket.id].userId);
        });
        socket.on('leaveArena',function () {
            console.log('leaver Arena Caught');
            var userData=userInfo[socket.id];
            if(typeof userData!=='undefined'){
                socket.leave(userData.arenaId);
                console.log('player left arena with id  '+userData.userId);}

        });

        socket.on('getArenas',function (req) {

            console.log('getArenas')
            require('./getArenas')(req,connectedUserList[req.userId]);

        });

        socket.on('getQuestions',function (req) {
            console.log('here get questions!');
            console.log(req);
            require('./getQuestion')(req,connectedUserList[req.userId]);

        });
        socket.on('sendNotication',function (req) {
          require('../controllers/sendNotification')(req.userId);
        })

        socket.on('disconnect',function () {
            console.log('User Disconcted');
            delete connectedUserList[socket.handshake.query.userId];

            var userData=userInfo[socket.id];
            if(typeof userData!=='undefined'){
                socket.leave(userData.arenaId);
                var otherUser=userInfo[socket.id].inviteId;
                console.log('player disconected invite id is :');
                console.log(otherUser);

                require('./updateUserStatus')(userInfo[socket.id].userId,userData.arenaId);

                if (connectedUserList[otherUser]!=null){
                    if(otherUser!=null) {
                        console.log('other user');
                        require('./getArenasOnDisconnect')(otherUser,connectedUserList[otherUser]);
                    }

                }

                delete userInfo[socket.id];
            }
        });


    });
};

//8dc63f
//231f20