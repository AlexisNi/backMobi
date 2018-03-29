/**
 * Created by alexn on 29/03/2018.
 */
/**
 * Created by alexn on 28/05/2017.
 */
var express = require('express'),
  router = express.Router()

var firebaseController = require('../controllers/firebase')
var testMiddleWre=require('../config/authGoogleGameServices');


router.post('/',testMiddleWre, firebaseController.checkAuth);



module.exports = router;
