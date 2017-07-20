/**
 * Created by alex on 19/02/2017.
 */
/**
 * Created by alex on 11/01/2017.
 */
var ArenaUser = require('../models/arena');
var User = require('../models/user');


module.exports = function (req, connectedUserList) {

   try {
        if (req.userId != null) {

            var arenasArray = [];
            User.findOne({_id: req.userId })//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE USER ROW AND SHOW THE LAST NAME OF INVITE
                .populate('arenas', '_id')
                .exec(function (err, arenasArr) {
                    if (err) {
                        throw err;
                    }
                    for (var i = 0; i < arenasArr.arenas.length; i++) {
                        arenasArray.push(arenasArr.arenas[i]._id);
                    }
                    ArenaUser.find({ $and: [{ user: arenasArr._id }, { _id: { $in: arenasArray } }] }, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
                        .populate('invite', 'username')
                        .deepPopulate('questions')
                        .exec(function (err, arenas) {
                            if (err) {
                                throw err;
                            }

                            ArenaUser.find({ $and: [{ invite: arenasArr._id  }, { _id: { $in: arenasArray } }] }, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
                                .populate('user', 'username')
                                .deepPopulate('questions')
                                .exec(function (err, arenasUser) {
                                    if (err) {

                                        throw err;
                                    }
                                    if (connectedUserList != null) {
                                        connectedUserList.emit('loadArenas', {
                                            obj: arenas,
                                            objUser: arenasUser
                                        });
                                    }


                                });
                        });
                });

        }
    } catch (err) {
        throw err;

    }


}