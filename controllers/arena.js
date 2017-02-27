var express = require('express');
var ArenaUser=require('../models/arena');
var User = require('../models/users');
var Questions=require('../models/questions');

exports.createArena=function (req,res,next) {
    User.findById(req.body.userId,function (err,user) {
        if (err){
            return res.status(500).json({
                title:'Error',
                message:'An error has occured....',
                status:'500'
            });
        }
        User.findById(req.body.inviteId,function (err,userInvite) {
            if (err) {
                return res.status(500).json({
                    title:'Error',
                    message:'An error has occured....',
                    status:'500'
                });
            }
            Questions.syncRandom(function (err, result) {
                console.log(result.updated);
            });
            Questions.findRandom().limit(10).exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occured',
                        error: err
                    });
                }
                ArenaUser.schema.eachPath(function (path) {
                    console.log(path);
                });
                var arenaUser = new ArenaUser({
                    user:user,
                    invite:userInvite,
                    status_accept:false,
                    questions:questions
                });
                arenaUser.save(function(err, result) {
                    if (err) {
                        console.log(err.errors.invite.message);
                        return res.status(500).json({
                            title:'Error',
                            message:err.errors.invite.message,
                            status:'500'
                        });
                    }
                    user.arenas.push(result);
                    user.save();
                    userInvite.arenas.push(result);
                    userInvite.save();

                    res.status(201).json({
                        message:'Saved Message',
                        obj:result
                    });
                });
            });
        });
    });

}
