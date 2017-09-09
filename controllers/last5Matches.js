var User = require('../models/user')

exports.update5Matches = function (req, res, next, userId, otherPlayerId, result) {
  return new Promise(function (resolve, reject) {

    var username


    User.findOne({_id: userId})
      .exec(function (err, matches) {
        if (err) {
          reject('error Not saved')
        }

        if (matches) {
          User.findOne({_id: otherPlayerId})
            .exec(function (err, userName) {
              if (err) {
                reject('error Not saved')
              }
              if (userName) {
                username = userName.username
                if (matches.last5Matches.length < 5) {
                  matches.last5Matches.unshift({result: result, userName: username});

                  resolve(matches.last5Matches);
                }
                else {
                  matches.last5Matches.pop()
                  matches.last5Matches.unshift({result: result, userName: username})

                  resolve(matches.last5Matches);
                }
              }
            })

        }

      })

  })

}
