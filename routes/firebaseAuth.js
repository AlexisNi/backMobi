/**
 * Created by alexn on 28/05/2017.
 */
var express = require('express'),
  router = express.Router();

var firebaseController=require('../controllers/firebase');
var middleware =require('../config/firebaseMiddleware');



router.post('/',middleware,firebaseController.checkAuth);
router.get('/protected',middleware, function(req, res){
  res.send({ content: 'Success'});

});



module.exports = router;
