var ArenaQuestions = require('../models/activeArena');
var ArenaUser = require('../models/arena');
var Awards = require('../models/awards');
var Statistics = require('../models/statistics');
var User = require('../models/user');
var level;
var experience;


exports.awards = function (req, res, next) {
    console.log('awards');
    var arenaId = req.body.arenaId;
    var userId = req.body.userId;
    Statistics.findOne({ user: userId }).exec(function (err, result) {
        if (err) {
            return res.status(500).json({
                message: 'Fail',
            });
        }
        if (!result) {
            var statistics = new Statistics({ user: userId });
            statistics.save();

            /*  return res.status(200).json({
                  message: 'success',
              });*/
        }
    });

    Awards.findOne().where({ arenaId: arenaId })
        .exec(function (err, result) {
            if (err) {
                return res.status(500).json({
                    message: 'Unexpected Error',
                });
            }
            try {
                if (result.awards.winner.userId == userId) {
                    try {
                        if (result.awards.winner.received != false) {
                            res.status(500).json({
                                where: 'At awards',
                                title: 'Error',
                                message: 'You already received that award....',
                                status: '500'
                            });

                        } else {
                            Statistics.findOne({ user: userId }).exec(function (err, statistics) {
                                if (err) {
                                    res.status(500).json({
                                        message: 'Unexpected Error'
                                    });
                                }
                                try {
                                    statistics.currentExp = statistics.currentExp + result.awards.winner.experience;
                                    statistics.wins = statistics.wins + 1;
                                    console.log('here is level');
                                    var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp);
                                    statistics.currentExp = levelInfo.currentExperience;
                                    statistics.level = levelInfo.level;
                                    statistics.save();
                                } catch (err) {
                                    return res.status(500).json({
                                        where: 'Awards',
                                        message: 'Unexpected error'
                                    });
                                }

                                User.findOne({ _id: userId })
                                    .populate({ path: 'arenas', match: { _id: arenaId } })
                                    .exec(function (err, user) {
                                        console.log('inside users');

                                        if (err) {
                                            res.status(500).json({
                                                message: 'Unexpected Error'
                                            });
                                        }
                                        try {
                                            result.awards.winner.received = true;
                                            result.save();
                                            user.arenas.pull({ _id: arenaId });
                                            user.save(function (err,saveres) {
                                              if(err){
                                                console.log(err);
                                                return res.status(500).json({

                                                  where: 'Awards',
                                                  message: 'Unexpected error'
                                                });
                                              }
                                              ArenaUser.findOne({ _id: arenaId })
                                                .exec(function (err, arena) {
                                                  if (err) {
                                                    console.log(err);
                                                    return res.status(500).json({
                                                      message: 'Unexpected Error'
                                                    });
                                                  }
                                                  try {
                                                    if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                                                      || result.awards.winner.received == true && result.awards.loser.received == true) {

                                                      arena.remove(function (err,result) {
                                                        if(err){
                                                          return res.status(500).json({
                                                            where: 'Awards',
                                                            message: 'Unexpected error'
                                                          });
                                                        }
                                                        if (result){
                                                          result.remove(function (err,res) {
                                                            if(err){
                                                              return res.status(500).json({
                                                                where: 'Awards',
                                                                message: 'Unexpected error'
                                                              });
                                                            }
                                                            return res.status(200).json({
                                                              message: 'All delete'
                                                            });

                                                          });

                                                        }

                                                      });


                                                    }
                                                    else{
                                                      return res.status(200).json({
                                                        message: 'All updated'
                                                      });

                                                    }
                                                  } catch (err) {
                                                    return res.status(500).json({
                                                      where: 'Awards',
                                                      message: 'Unexpected error',
                                                    });
                                                  }
                                                });

                                            });
                                        } catch (err) {
                                            return res.status(500).json({
                                                where: 'Awards',
                                                message: 'Unexpected error',
                                            });
                                        }
                                       /* ArenaUser.findOne({ _id: arenaId })
                                            .exec(function (err, arena) {
                                                if (err) {
                                                    return res.status(500).json({
                                                        message: 'Unexpected Error',
                                                    });
                                                }
                                                try {
                                                    if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                                                        || result.awards.winner.received == true && result.awards.loser.received == true) {

                                                        arena.remove(function (err,result) {
                                                          if(err){
                                                            return res.status(500).json({
                                                              where: 'Awards',
                                                              message: 'Unexpected error',
                                                            });
                                                          }
                                                          if (result){
                                                            result.remove(function (err,res) {
                                                              if(err){
                                                                return res.status(500).json({
                                                                  where: 'Awards',
                                                                  message: 'Unexpected error',
                                                                });
                                                              }
                                                              return res.status(200).json({
                                                                message: 'All delete'
                                                              });

                                                            });

                                                          }

                                                        });


                                                    }
                                                } catch (err) {
                                                    return res.status(500).json({
                                                        where: 'Awards',
                                                        message: 'Unexpected error',
                                                    });
                                                }
                                            });*/



                                    });



                      /*          return res.status(200).json({
                                    message: 'success'
                                });
*/
                            });
                        }
                    } catch (err) {
                        return res.status(500).json({
                            where: 'Awards',
                            message: 'Unexpected error',
                        });
                    }
                } else if (result.awards.loser.userId == userId) {
                    
                    if (result.awards.loser.received != false) {
                        return res.status(500).json({
                            where: 'At awards',
                            title: 'Error',
                            message: 'You already received that award....',
                            status: '500'
                        });
                    } else {
                        Statistics.findOne({ user: userId }).exec(function (err, statistics) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Unexpected Error',
                                });
                            }
                            statistics.currentExp = statistics.currentExp + result.awards.loser.experience;
                            statistics.loses = statistics.loses + 1;
                            console.log('here is level');
                            var levelInfo = require('./LevelUp')(statistics.level, statistics.currentExp);
                            statistics.currentExp = levelInfo.currentExperience;
                            statistics.level = levelInfo.level;
                            statistics.save();
                        });
                        User.findOne({ _id: userId })
                            .populate({ path: 'arenas', match: { _id: arenaId } })
                            .exec(function (err, user) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Unexpected Error',
                                    });
                                }
                                result.awards.loser.received = true;
                                result.save();
                                user.arenas.pull({ _id: arenaId });
                                user.save();

                                ArenaUser.findOne({ _id: arenaId })
                                    .exec(function (err, arena) {
                                        console.log('Arenas delete')

                                        if (err) {
                                            return res.status(500).json({
                                                message: 'Unexpected Error',
                                            });
                                        }
                                        console.log(result.awards.winner.received);

                                        console.log(result.awards.loser.received);

                                        if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                                            || result.awards.winner.received == true && result.awards.loser.received == true) {

                                            arena.remove();
                                            result.remove();

                                        }
                                    });

                                return res.status(200).json({
                                    message: 'success'
                                });



                            });
                    }
                } else {
                    Statistics.findOne({ user: userId }).exec(function (err, statistics) {
                        if (result.awards.draw.receivedP2 == userId) {
                            return res.status(500).json({
                                where: 'Awards',
                                message: 'Award already received',
                            });
                        } else if (result.awards.draw.receivedP1 == userId) {
                            return res.status(500).json({
                                where: 'Awards',
                                message: 'Award already received',
                            });
                        } else {
                            statistics.currentExp = statistics.currentExp + result.awards.draw.experience;
                            statistics.points = statistics.points + 1;
                            statistics.draws = statistics.draws + 1;
                            console.log('here is level');
                            var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp);
                            statistics.currentExp = levelInfo.currentExperience;
                            statistics.level = levelInfo.level;
                            statistics.save();

                            if (result.awards.draw.receivedP1 == '123') {
                                result.awards.draw.receivedP1 = userId;
                                result.save();
                                User.findOne({ _id: userId })
                                    .populate({ path: 'arenas', match: { _id: arenaId } })
                                    .exec(function (err, user) {
                                        if (err) {
                                            return res.status(500).json({
                                                message: 'Unexpected Error',
                                            });
                                        }
                                        user.arenas.pull({ _id: arenaId });
                                        user.save();
                                        ArenaUser.findOne({ _id: arenaId })
                                            .exec(function (err, arena) {
                                                console.log('Arenas delete')

                                                if (err) {
                                                    return res.status(500).json({
                                                        message: 'Unexpected Error',
                                                    });
                                                }
                                                console.log(result.awards.winner.received);

                                                console.log(result.awards.loser.received);

                                                if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                                                    || result.awards.winner.received == true && result.awards.loser.received == true) {

                                                    arena.remove();
                                                    result.remove();
                                                }
                                            });
                                    });




                                return res.status(200).json({
                                    message: 'success'
                                })


                            }

                            else if (result.awards.draw.receivedP2 == '123') {
                                result.awards.draw.receivedP2 = userId;
                                result.save();

                                User.findOne({ _id: userId })
                                    .populate({ path: 'arenas', match: { _id: arenaId } })
                                    .exec(function (err, user) {
                                        if (err) {
                                            return res.status(500).json({
                                                message: 'Unexpected Error',
                                            });
                                        }
                                        result.awards.loser.received = true;
                                        result.save();
                                        user.arenas.pull({ _id: arenaId });
                                        user.save();

                                        ArenaUser.findOne({ _id: arenaId })
                                            .exec(function (err, arena) {
                                                console.log('Arenas delete')

                                                if (err) {
                                                    return res.status(500).json({
                                                        message: 'Unexpected Error',
                                                    });
                                                }


                                                if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                                                    || result.awards.winner.received == true && result.awards.loser.received == true) {


                                                    result.remove();
                                                    arena.remove();

                                                }
                                            });
                                    });


                                return res.status(200).json({
                                    message: 'success'
                                });
                            } else {
                                return res.status(500).json({
                                    where: 'Awards',
                                    message: 'Unexpected error',
                                });
                            }



                        }
                    });
                }
            } catch (err) {
                return res.status(500).json({
                    where: 'Awards',
                    message: 'Unexpected error',
                });

            }
        });
}


