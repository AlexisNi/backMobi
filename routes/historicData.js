/**
 * Created by alexn on 03/09/2017.
 */
var historicDataController=require('../controllers/historicData');
express = require('express'),
  passportService = require('../config/passport'),
  passport = require('passport');
var middleware = require('../config/firebaseMiddleware')

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/', middleware,historicDataController.getHistoricDataVsOpponent);
router.post('/stats', middleware,historicDataController.getStats);







module.exports = router;