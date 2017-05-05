/**
 * Created by alex on 19/02/2017.
 */
var User = require('../models/users');



exports.findUser=function (req,res,next) {
    console.log('User Fin');
    var userName=req.body.username;
    User.findOne({userName:userName},function (err,user) {
        if (err) {
           return res.status(500).json({
                title:'Error',
                message:'An error has occured....',
                status:'500'
            });
        }
        if(!user){
         return    res.status(400).json({
                title:'No results',
                message:'User Not Found',
                status:'400'
            });
        }
     return  res.status(200).json({
            message:'User Found',
            userName:user.userName,
            inviteId:user._id
        });
    });

}
exports.findOpponent=function (req,res,next) {

    
}
