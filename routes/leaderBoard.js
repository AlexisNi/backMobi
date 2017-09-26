/**
 * Created by alex on 07/03/2017.
 */
var leaderBoard=require('../controllers/leaderboard');
var express = require('express')
var middleware = require('../config/firebaseMiddleware')

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.get('/', middleware,leaderBoard.getLeaderBoard);






module.exports = router;