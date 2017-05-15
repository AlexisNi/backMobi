/**
 * Created by alex on 02/03/2017.
 */
var ArenaUser=require('../models/arena');
var Awards=require('../models/awards');
var Statistics=require('../models/statistics');
var User=require('../models/users');
var level;
var experience;


exports.awards=function (req,res,next) {
    console.log('get awezards!!!!!')
    var arenaId=req.body.arenaId;
    var userId=req.body.userId;
    Statistics.findOne({user:userId}).exec(function (err,result) {
        if (!result){
            var statistics=new Statistics({user:userId});
            statistics.save();

            res.status(200).json({
                message:'success',
            });

        }if(err){
            res.status(200).json({
                message:'Fail',
            });
        }
    });
    Awards.findOne().where({arenaId:arenaId})
        .exec(function (err,result) {
            if(err){
                res.status(200).json({
                    message:'Unexpected Error',
                });
            }
            if(result.awards.winner.userId==userId){
                Statistics.findOne({user:userId}).exec(function (err,statistics) {

                    if(err){
                        res.status(200).json({
                            message:'Unexpected Error',
                        });
                    }
                    statistics.currentExp=statistics.currentExp+result.awards.winner.experience;
                    statistics.wins=statistics.wins+1;
                    console.log('here is level');
                    var levelInfo=require('./checkLevelUp')(statistics.level,statistics.currentExp);
                    statistics.currentExp=levelInfo.currentExperience;
                    statistics.level=levelInfo.level;
                    statistics.save();

                });
                User.findOne({_id:userId})
                    .populate({path:'arenas',match:{_id:arenaId}})
                    .exec(function (err,user) {

                        if(err){
                            res.status(200).json({
                                message:'Unexpected Error',
                            });
                        }
                        user.arenas.pull({_id:arenaId});
                        user.save();



                    });


            }
            else if(result.awards.loser.userId==userId)
            {

                Statistics.findOne({user:userId}).exec(function (err,statistics) {

                    if(err){
                        res.status(200).json({
                            message:'Unexpected Error',
                        });
                    }
                    statistics.currentExp=statistics.currentExp+result.awards.loser.experience;
                    statistics.loses=statistics.loses+1;
                    console.log('here is level');
                    var levelInfo=require('./LevelUp')(statistics.level,statistics.currentExp);
                    statistics.currentExp=levelInfo.currentExperience;
                    statistics.level=levelInfo.level;

                    statistics.save();

                });
                User.findOne({_id:userId})
                    .populate({path:'arenas',match:{_id:arenaId}})
                    .exec(function (err,user) {

                        if(err){
                            res.status(200).json({
                                message:'Unexpected Error',
                            });
                        }
                        console.log(user.arenas);
                        user.arenas.pull({_id:arenaId});
                        user.save();
                    });

            }else {

                Statistics.findOne({user:userId}).exec(function (err,statistics) {

                    if(err){
                        res.status(200).json({
                            message:'Unexpected Error',
                        });
                    }
                    statistics.currentExp=statistics.currentExp+result.awards.draw.experience;
                    statistics.points = statistics.points+1;
                    statistics.draws=statistics.draws+1;
                    console.log('here is level');
                    var levelInfo=require('./checkLevelUp')(statistics.level,statistics.currentExp);
                    statistics.currentExp=levelInfo.currentExperience;
                    statistics.level=levelInfo.level;

                    statistics.save();

                });
                User.findOne({_id:userId})
                    .populate({path:'arenas',match:{_id:arenaId}})
                    .exec(function (err,user) {

                        if(err){
                            res.status(200).json({
                                message:'Unexpected Error',
                            });
                        }
                        user.arenas.pull({_id:arenaId});
                        user.save();
                    });
            }
            ArenaUser.findOne({_id:arenaId})
                .exec(function (err,arena) {

                    if(err){
                        res.status(200).json({
                            message:'Unexpected Error',
                        });
                    }
                    if(arena.awardPlayerOne==false&&arena.awardPlayerTwo==false){
                        arena.awardPlayerOne=true;
                        arena.save();
                    }else {
                        arena.remove();

                    }

                });

        });

    res.status(200).json({
        message:'succecss',
    });



}