/**
 * Created by alex on 16/02/2017.
 */
var AuthenticationController = require('../controllers/authentication'),
    express = require('express'),
    passport = require('passport');
var passportService = require('../config/passport');
var router=express.Router();

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


router.post('/register', AuthenticationController.register);
router.post('/login', requireLogin, AuthenticationController.login);

router.get('/protected', requireAuth, function(req, res){
    res.send({ content: 'Success'});
});


module.exports = router;
