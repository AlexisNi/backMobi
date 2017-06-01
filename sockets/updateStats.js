/**
 * Created by alex on 25/02/2017.
 */
var Statistics=require('../models/statistics');

module.exports=function (io,connectedUserList) {
    io.on('getStats',function (req) {
        console.log('get stasts');
        Statistics.findOne({firebase_id:req.userId}).exec(function (err,result) {
            if (err) {
                throw err;
            }
            if(connectedUserList!=null) {
                connectedUserList.emit('loadStats', {
                    obj: result,
                    message:'Loaded succesfully'
                });
            }
        });


    });

};