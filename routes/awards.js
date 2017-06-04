
var AuthenticationController = require('../controllers/authentication'),
    awardsController=require('../controllers/awards');
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
var middleware = require('../config/firebaseMiddleware')

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/', middleware,awardsController.awards);







module.exports = router;