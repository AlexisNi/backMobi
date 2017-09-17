/**
 * Created by alexn on 24/06/2017.
 */
/**
 * Created by alex on 19/02/2017.
 */
/**
 * Created by alex on 11/01/2017.
 */
var ArenaUser = require('../models/arena')

module.exports = function (req, connectedUserList) {
  try {
    if (req.userId != null) {


          ArenaUser.findOne({$and: [{user: req.userId}, {_id: req.arenaId}]}, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
            .populate('invite', 'username')
            .deepPopulate('questions')
            .exec(function (err, arenas) {
              if (err) {
                throw err
              }

              ArenaUser.findOne({$and: [{invite: req.userId}, {_id: req.arenaId}]}, 'user invite invite_played  status_accept  user_played')//HERE IS SEARCHING WITH THE USER TOKEN PARAMETER IN THE ARENA DATABASE AT THE INVITE ROW AND SHOWS THE LAST NAME OF THE USER
                .populate('user', 'username')
                .deepPopulate('questions')
                .exec(function (err, arenasUser) {
                  if (err) {

                    throw err
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

}