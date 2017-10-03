/**
 * Created by alex on 11/01/2017.
 */
var ArenaUser = require('../models/arena')
module.exports = function (otherUser, connectedUserList,arenaId) {

  try {
    if (otherUser!= null) {

      ArenaUser.findOne({$and: [{user: otherUser}, {_id: arenaId}]}, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
        .populate('invite', 'username')
        .deepPopulate('questions')
        .exec(function (err, arenas) {
          if (err) {
            throw err
          }
          try{
            arenas.user_played=true;
          }catch (err) {

          }



          ArenaUser.findOne({$and: [{invite: otherUser}, {_id: arenaId}]}, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
            .populate('user', 'username')
            .deepPopulate('questions')
            .exec(function (err, arenasUser) {
              if (err) {

                throw err
              }
              try{
                arenas.invite_played=true;
              }catch (err) {

              }
              if (connectedUserList != null) {
                connectedUserList.emit('loadOneArena', {
                  obj: arenas,
                  objUser: arenasUser
                })
              }

            })
        })

    }
  } catch (err) {
    throw err

  }

  /*
   var arenasArray = [];
   User.findOne({_id: otherUser/!*socket.handshake.query.userId*!/})//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE USER ROW AND SHOW THE LAST NAME OF INVITE
   .populate('arenas', '_id')
   .exec(function (err, arenasArr) {

   if (err) {
   throw err;
   }
   for (var i = 0; i < arenasArr.arenas.length; i++) {
   arenasArray.push(arenasArr.arenas[i]._id);
   }
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
   connectedUserList.emit('loadOneArena', {

   obj: arenas,
   objUser: arenasUser
   })
   }
   });
   });
   });
   */

}
