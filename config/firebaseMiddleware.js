/**
 * Created by alexn on 28/05/2017.
 */
var admin = require("firebase-admin");

module.exports =function (req,res,next) {
  var token=req.get('authorization');
  admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      req.body.uid=uid;
      next();
    }).catch(function(error) {
      return res.status(401).json({
        message:'Not Authenticated'
      });
  });

}