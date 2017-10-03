/**
 * Created by alex on 02/03/2017.
 */
var Arenas=require('../models/arena');
module.exports=function (userId,arenaId) {
    console.log('Post Received played status');


    Arenas.findOne({_id:arenaId})
        .populate('user')
        .populate('invite')
        .exec(function (err,arenas) {
            if (arenas!==null){
                if (arenas.user._id==userId){
                    Arenas.findOneAndUpdate({_id:arenaId},{$set:{user_played:true}},{new:true},function (err, result) {
                        if (err) {
                            throw err;
                        }else {
                          if (result) {
                            if (result.user_played == true && result.invite_played == true) {
                              require('../controllers/awardsControllers/awardCreate').awardCreate(arenas.user._id, arenas.invite._id, arenaId);

                            }
                          }
                        }

                    });

                }else {
                    Arenas.findOneAndUpdate({_id:arenaId},{$set:{invite_played:true}},{new:true},function (err, result) {
                        if (err) {
                            throw err;
                        }else{
                          if(result){
                            if(result.user_played==true && result.invite_played==true){
                              require('../controllers/awardsControllers/awardCreate').awardCreate(arenas.user._id,arenas.invite._id,arenaId);
                            }
                          }

                        }


                    });
                }


            }

        });
}



