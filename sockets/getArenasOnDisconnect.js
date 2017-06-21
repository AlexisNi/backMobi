/**
 * Created by alex on 11/01/2017.
 */
var ArenaUser=require('../models/arena');
var User=require('../models/user');
module.exports=function (otherUser,connectedUserList) {

    var arenasArray = [];
    User.findOne({_id: otherUser/*socket.handshake.query.userId*/})//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE USER ROW AND SHOW THE LAST NAME OF INVITE
        .populate('arenas', '_id')
        .exec(function (err, arenasArr) {

            if (err) {
                throw err;
            }
            for (var i = 0; i < arenasArr.arenas.length; i++) {
                arenasArray.push(arenasArr.arenas[i]._id);
            }
            console.log(arenasArr);
            ArenaUser.find({$and: [{user: otherUser}, {_id: {$in: arenasArray}}]})//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
                .populate('invite', 'username')
                .deepPopulate('questions')
                .exec(function (err, arenas) {

                    if (err) {
                        throw err;
                    }

                    ArenaUser.find({$and: [{invite: otherUser}, {_id: {$in: arenasArray}}]})//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
                        .populate('user', 'username')
                        .deepPopulate('questions')
                        .exec(function (err, arenasUser) {
                            if (err) {

                                throw err;
                            }
                            if(connectedUserList!=null) {
                                connectedUserList.emit('loadArenas', {
                                    obj: arenas,
                                    objUser: arenasUser
                                })
                            }
                        });
                });
        });

}
