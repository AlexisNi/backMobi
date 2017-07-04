/**
 * Created by alex on 16/02/2017.
 */
var AuthenticationController = require('../controllers/authentication'),
    arenaController = require('../controllers/arena'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();
var middleware = require('../config/firebaseMiddleware')



// Todo Routes

router.post('/ra',requireAuth,function (res,req) {
    console.log('Entered') ;
});
router.post('/', middleware,arenaController.createArena);
router.post('/statusPlayed', middleware,arenaController.statusPlayed);
router.post('/getArenas', middleware,arenaController.getArenas);



// Set up routes

module.exports = router;

