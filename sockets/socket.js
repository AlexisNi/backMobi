/**
 * Created by alex on 17/02/2017.
 */
var User = require('../models/users');
var jwt=require('jsonwebtoken');
var config = require('../config/auth');
var passport = require('passport');
var connectedUserList=[];

module.exports = function (io) {
    var authSocket=  require('socketio-auth')(io, {
            authenticate: function (socket, data, callback) {
                socket.removeAllListeners('authentication');

                    try {
                        var token=data.token.substring(4);
                        var decode=jwt.verify(token,config.secret);
                    } catch (e){console.log(e)}

                       User.findById(decode._id, function(err, user){
                           if (err || !user) return callback(new Error("User not found"));
                           return callback(null,true);

                        });

            }

        });

    io.on('connection',function (socket) {
        console.log('user connected');
        connectedUserList[socket.handshake.query.userId]=socket;
        require('./updateStats')(socket,connectedUserList[socket.handshake.query.userId]);




    });
};