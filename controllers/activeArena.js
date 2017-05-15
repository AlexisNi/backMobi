/**
 * Created by alex on 02/03/2017.
 */
var ArenaQuestions = require('../models/activeArena');
var Awards = require('../models/awards');
var User = require('../models/users');
var Arenas = require('../models/arena');


exports.saveAnsweredQuestion = function (req, res, next) {
    ArenaQuestions.findOne({ $and: [{ arenaId: req.body.arenaId }, { userId: req.body.userId }] })
        .exec(function (err, arenaQuestion) {
            if (arenaQuestion) {
                ArenaQuestions.update({ _id: arenaQuestion._id }, { $push: { questionAnswer: req.body.question } }, function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured....',
                            status: '500'
                        });
                    }
                    res.status(201).json({
                        message: 'QuestionAnswer created',
                        obj: result
                    });

                });

            } else {
                var arenaQuestion = new ArenaQuestions({
                    arenaId: req.body.arenaId,
                    userId: req.body.userId,
                    questionAnswer: req.body.question

                });
                arenaQuestion.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'Error',
                            message: 'An error has occured....',
                            status: '500'
                        });
                    }
                    res.status(201).json({
                        message: 'QuestionSaved created',
                        obj: result
                    });
                });

            }
        });
}
exports.getQuestions = function (req, res, next) {
    let arenaId = req.body.arenaId
    try {
        Arenas.findOne({ _id: arenaId })
            .exec(function (err, arena) {
                try {

                    if (err) {
                        return res.status(500).json({
                            title: 'An error occured',
                            error: err
                        });
                    }
                    if (req.body.userId == arena.user) {
                        if (arena.user_played == true) {
                            return res.status(500).json({
                                title: 'An error occured',
                            });
                        } else {
                            Arenas.findOne({ _id: arenaId })
                                .populate('questions')
                                .exec(function (err, questions) {
                                    try {
                                        if (err) {
                                            return res.status(500).json({
                                                title: 'An error occured',
                                                error: err
                                            });
                                        }
                                        return res.status(200).json({
                                            message: 'Questions received',
                                            questions: questions.questions,
                                        });
                                    } catch (err) {
                                        return res.status(500).json({
                                            title: 'Unable to load Questions',
                                            error: err
                                        });
                                    }
                                });

                        }
                    }
                    if (req.body.userId == arena.invite) {
                        if (arena.invite_played == true) {
                            return res.status(500).json({
                                title: 'You already played',
                            });
                        } else {
                            Arenas.findOne({ _id: arenaId })
                                .populate('questions')
                                .exec(function (err, questions) {
                                    try {
                                        if (err) {
                                            return res.status(500).json({
                                                title: 'An error occured',
                                                error: err
                                            });
                                        }
                                        return res.status(200).json({
                                            message: 'Questions received',
                                            questions: questions.questions,
                                        });
                                    } catch (err) {
                                        return res.status(500).json({
                                            title: 'Unable to load Questions',
                                            error: err
                                        });
                                    }
                                });
                        }

                    }



                } catch (err) {
                    return res.status(500).json({
                        title: 'An error occured',
                        error: err
                    });

                }


            });
    } catch (err) {
        return res.status(500).json({
            title: 'An error occured',
            error: err
        });
    }




    /*        Arenas.findOne({ _id: arenaId })
                .populate('questions')
                .exec(function (err, questions) {
                    try {
                        if (err) {
                            return res.status(500).json({
                                title: 'An error occured',
                                error: err
                            });
                        }
                        return res.status(200).json({
                            message: 'Questions received',
                            questions: questions.questions,
                        });
                    } catch (err) {
                        return res.status(500).json({
                            title: 'Unable to load Questions',
                            error: err
                        });
                    }
                });*/


}
exports.getCorrectNumber = function (req, res, next) {
    var arenaId = req.body.arenaId;
    var userId = req.body.userId;
    ArenaQuestions.findOne().where({ $and: [{ arenaId: arenaId }, { userId: userId }] })
        .populate('userId', 'useName')
        .exec(function (err, answerCount) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            if (answerCount != null) {
                res.status(200).json({
                    message: 'Correct',
                    correct: answerCount.questionAnswer.length-1,
                });

            } else {

                res.status(200).json({
                    message: 'Correct',
                    correct: 0,
                });
            }


        });
}
exports.getResults = function (req, res, next) {
    console.log('getResult');
    console.log(req.body)
    var arenaId = req.body.arenaId;
    var userId = req.body.userId;
    ArenaQuestions.findOne().where({ $and: [{ arenaId: arenaId }, { userId: userId }] })
        .populate('userId', 'userName')
        .exec(function (err, answerCount) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
              if (answerCount == null) {
                        console.log('nullllllll')
                    }
           
            
            ArenaQuestions.findOne().where({ $and: [{ arenaId: arenaId }, { userId: { $ne: userId } }] })
                .populate('userId', 'userName')
                .exec(function (err, answerCountB) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occured',
                            error: err
                        });
                    }
                  

                    if (answerCountB == null) {
                        answerCountB.questionAnswer.length = 0;
                    }
                    if (answerCount.questionAnswer.length > answerCountB.questionAnswer.length) {
                        var awards = {
                            awards: {
                                arenaId: arenaId, winner: {
                                    userId: '', arenaId: '', points: 3, experience: 140
                                }, loser: {
                                    userId: '', arenaId: '', points: 0, experience: 40
                                }
                            }
                        };

                        Awards.findOne({ arenaId: arenaId }).exec(function (err, getAwards) {
                            if (!getAwards) {
                                awards = new Awards({
                                    arenaId: arenaId, awards: {
                                        arenaId: arenaId, winner: {
                                            userId: answerCount.userId._id, points: 3, experience: 140
                                        }, loser: {
                                            userId: answerCountB.userId._id, points: 0, experience: 40
                                        }
                                    }
                                });
                                awards.save();

                            } else {
                                awards = getAwards;

                            }


                            res.status(200).json({
                                message: 'success',
                                winner: answerCount.userId,
                                loser: answerCountB.userId,
                                awards: awards,
                                draw: false


                            });


                        });

                    } else if (answerCount.questionAnswer.length < answerCountB.questionAnswer.length) {
                        var awards = {
                            awards: {
                                arenaId: arenaId, winner: {
                                    userId: '', arenaId: '', points: 3, experience: 140
                                }, loser: {
                                    userId: '', arenaId: '', points: 0, experience: 40
                                }
                            }
                        };

                        Awards.findOne({ arenaId: arenaId }).exec(function (err, getAwards) {
                            if (!getAwards) {
                                awards = new Awards({
                                    arenaId: arenaId, awards: {
                                        arenaId: arenaId, winner: {
                                            userId: answerCountB.userId._id, points: 3, experience: 140
                                        }, loser: {
                                            userId: answerCount.userId._id, points: 0, experience: 40
                                        }
                                    }
                                });
                                awards.save();

                            } else {
                                awards = getAwards;

                            }
                            res.status(200).json({
                                message: 'success',
                                loser: answerCount.userId,
                                winner: answerCountB.userId,
                                awards: awards,
                                draw: false

                            });


                        });



                    }
                    else {
                        var awards = {
                            awards: {
                                arenaId: arenaId, winner: {
                                    userId: '', arenaId: '', points: 3, experience: 140
                                }, loser: {
                                    userId: '', arenaId: '', points: 0, experience: 40
                                }
                            }
                        };

                        Awards.findOne({ arenaId: arenaId }).exec(function (err, getAwards) {
                            if (!getAwards) {
                                awards = new Awards({
                                    arenaId: arenaId, awards: {
                                        arenaId: arenaId, draw: {
                                            userId: answerCountB.userId._id, points: 1, experience: 70
                                        }
                                    }
                                });
                                awards.save();

                            } else {
                                awards = getAwards;

                            }
                            res.status(200).json({
                                message: 'success',
                                winner: answerCount.userId,
                                loser: answerCountB.userId,
                                draw: true,
                                awards: awards

                            });


                        });
                    }

                });
        });




}