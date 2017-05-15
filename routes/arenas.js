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



// Todo Routes

router.post('/ra',requireAuth,function (res,req) {
    console.log('Entered') ;
});
router.post('/', requireAuth,arenaController.createArena);
router.post('/statusPlayed', requireAuth,arenaController.statusPlayed);


// Set up routes

module.exports = router;

