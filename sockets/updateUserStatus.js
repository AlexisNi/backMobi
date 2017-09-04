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
                    Arenas.update({_id:arenaId},{$set:{user_played:true}},function (err, result) {
                        if (err) {
                            throw err;
                        }

                    });

                }else {
                    Arenas.update({_id:arenaId},{$set:{invite_played:true}},function (err, result) {
                        if (err) {
                            throw err;
                        }

                    });
                }
            }

        });
}



