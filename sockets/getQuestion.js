/**
 * Created by alex on 02/03/2017.
 */
 var Arenas=require('../models/arena');

module.exports=function (req,connectedUserList) {
    console.log(req.arenaId);

    Arenas.findOne({_id:req.arenaId})
        .populate('questions')
        .exec(function (err,arenas) {

            if (err) {
                throw err;
            }
            if(connectedUserList!=null) {
                connectedUserList.emit('loadQuestions', {
                    obj: arenas.questions
                })
            }

            console.log(arenas);


        });


}