
var AuthenticationController = require('../controllers/authentication'),
    awardsController=require('../controllers/awards');
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/', requireAuth,awardsController.awards);







module.exports = router;