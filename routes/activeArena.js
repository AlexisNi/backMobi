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
router.post('/getCorrect', requireAuth,activeArenaController.getCorrectNumber);
router.post('/getQuestions', requireAuth,activeArenaController.getQuestions);
router.post('/getResults', requireAuth,activeArenaController.getResults);






module.exports = router;