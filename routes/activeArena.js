/**
 * Created by alex on 07/03/2017.
 */
var AuthenticationController = require('../controllers/authentication'),
    activeArenaController=require('../controllers/activeArena');
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/', requireAuth,activeArenaController.saveAnsweredQuestion);



module.exports = router;