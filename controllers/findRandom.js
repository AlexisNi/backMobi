/**
 * Created by alexn on 23/07/2017.
 */
var User = require('../models/user')

exports.findRandomPlayer=function (req,res,next,userId) {
  var userId = req.body.userId
  var filter
  var arrayId = []
  User.findById(userId)
    .populate('arenas')
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'Error',
          message: 'Could not find user',
          status: '500'
        })
      }

      if (result) {
        for (var i = 0; i < result.arenas.length; i++) {
          if(result.arenas[i].user!=userId){
            arrayId.push(result.arenas[i].user);
          }
          if(result.arenas[i].invite!=userId){
            arrayId.push(result.arenas[i].invite);
          }
        }
        arrayId.push(userId);

        User.count({_id:{$nin:arrayId}}).exec(function (err,count) {
          var random = Math.floor(Math.random() * count);
          User.findOne({_id:{$nin:arrayId}})
            .populate('statistics')
            .skip(random)
            .exec(function (err,randomUser) {

              if (randomUser){
                return res.status(200).json({
                  message: 'User Found',
                  username: randomUser.username,
                  inviteId: randomUser._id,
                  statistics: randomUser.statistics
                })
              }
              else {
                return res.status(500).json({
                  title: 'Error',
                  message: 'Sorry couldnt find user please try again....',
                  status: '500'
                })
              }


            })


        })


      }

    })
}
