var express = require('express');
var ArenaUser = require('../models/arena');
var User = require('../models/users');
var Questions = require('../models/questions');

exports.createArena = function (req, res, next) {
    try {
        User.findById(req.body.userId, function (err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    message: 'An error has occured....',
                    status: '500'
                });
            }
            User.findById(req.body.inviteId, function (err, userInvite) {
                if (err) {
                    return res.status(500).json({
                        title: 'Error',
                        message: 'An error has occured....',
                        status: '500'
                    });
                }
                Questions.syncRandom(function (err, result) {
                });
                Questions.findRandom().limit(10).exec(function (err, questions) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occured',
                            error: err
                        });
                    }
                    ArenaUser.schema.eachPath(function (path) {
                    });
                    var arenaUser = new ArenaUser({
                        user: user,
                        invite: userInvite,
                        status_accept: false,
                        questions: questions
                    });
                    arenaUser.save(function (err, result) {
                       /* try {*/
                            
                            if (err) {
                                return res.status(500).json({
                                    title: 'Error',
                                    message: err.errors.invite.message,
                                    status: '500'
                                });
                            }
                            user.arenas.push(result);
                            user.save();
                            userInvite.arenas.push(result);
                            userInvite.save();

                          return  res.status(201).json({
                                message: 'Saved Message',
                                obj: result
                            });
                     /*   } catch (err) {
                            return res.status(500).json({
                                where: 'Create arenas',
                                title: 'Arena already exist',
                                message: 'An error occured',
                                status: '500'
                            });
                        }*/
                    });
                });
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            where: 'Create arenas',
            title: 'Arena already exist or Unknow error',
            message: 'An error occured',
            status: '500'
        });

    }
}
exports.statusPlayed = function (req, res, next) {
    console.log('Post Received played status');
    console.log(req.body);
    var userId = req.body.userId;
    var arenaId = req.body.arenaId;
    ArenaUser.findOne({ _id: arenaId })
        .populate('user')
        .populate('invite')
        .exec(function (err, arenas) {
            try {
                if (arenas.user._id == userId) {
                    try {
                        ArenaUser.update({ _id: arenaId }, { $set: { user_played: true } }, function (err, result) {
                            if (err) {
                                return res.status(500).json({
                                    title: 'An error occurred',
                                    error: err
                                });
                            }
                            res.status(200).json({
                                message: 'success',
                            });
                        });
                    } catch (err) {
                        return res.status(500).json({
                            where: 'Status Play',
                            title: 'Error',
                            message: 'An error has occured....',
                            status: '500'
                        });
                    }
                } else {
                    ArenaUser.update({ _id: arenaId }, { $set: { invite_played: true } }, function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                title: 'Error',
                                message: 'An error has occured....',
                                status: '500'
                            });
                        }
                        res.status(200).json({
                            message: 'success',
                        });
                    });
                }


            } catch (err) {
                return res.status(500).json({
                    where: 'Status Play',
                    title: 'Error',
                    message: 'An error has occured....',
                    status: '500'
                });

            }
        });


}

exports.getResult = function (req, res, next) {
    try {
        var arenaId = req.body.arenaId;
        var userId = req.body.userId;


    }
    catch (err) {
        return res.status(500).json({
            title: 'Error',
            message: 'An error has occured....',
            status: '500'
        });
    }

}