/**
 * Created by alexn on 29/03/2018.
 */
/**
 * Created by alexn on 28/05/2017.
 */
let express = require('express'),
  router = express.Router()

let firebaseController = require('../controllers/firebase')
let testMiddleWre=require('../config/authGoogleGameServices').checkAuth;
let checkTokenMiddleWare= require('../config/authGoogleGameServices').checkToken;


router.post('/',testMiddleWre, firebaseController.checkAuth);
router.post('/checkToken',checkTokenMiddleWare,firebaseController.checkAuth);



module.exports = router;
