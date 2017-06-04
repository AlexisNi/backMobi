/**
 * Created by alex on 07/03/2017.
 */
var AuthenticationController = require('../controllers/authentication'),
    activeArenaController=require('../controllers/activeArena');
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
var middleware = require('../config/firebaseMiddleware')

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/', middleware,activeArenaController.saveAnsweredQuestion);
router.post('/getCorrect', middleware,activeArenaController.getCorrectNumber);
router.post('/getQuestions', middleware,activeArenaController.getQuestions);
router.post('/getResults', middleware,activeArenaController.getResults);






module.exports = router;