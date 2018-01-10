/**
 * Created by alexn on 18/12/2017.
 */
var Hints=require('../models/hints');


exports.checkIfActiveDaemon=function () {
  setInterval(()=>{
    Hints.find({}).exec((err,allHints)=>{
      if(err){
        return false;
      }if(allHints){
        allHints.map(async (hint)=>{
          await hint.checkIfActivate();
        })
      }
    })
  },600000)
}
exports.checkIfHintsIsActive=function (req,res,next) {
  var userId= req.body.userId;


  Hints.findOne({userId: userId}).exec(async function (err, hint) {
    if (err) {
      return res.status(500).json({
        message: 'Fail to use Hint'
      })
    }
    if (hint) {
      let canUseHint=await hint.checkIfActivateToUse();
      if(canUseHint!==false){
        return res.status(200).json({
          canUseHint: canUseHint
        })
      }else{
        return res.status(200).json({
          canUseHint: false
        })
      }
    }
  })


}
exports.useHint= function (req,res,next) {
  var userId= req.body.userId;
  var hintToUse=req.body.hintToUse;


  Hints.findOne({userId: userId}).exec(async function (err, hint) {
    if (err) {
      return res.status(500).json({
        message: 'Fail to use Hint'
      })
    }
    if (hint) {
     let canUseHint=await hint.useHint(hintToUse);
     if(canUseHint!==false){
       return res.status(200).json({
         canUse: true
       })
     }else{
       return res.status(200).json({
         canUse: false
       })
     }


    }
  })



}