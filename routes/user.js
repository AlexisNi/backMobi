
var AuthenticationController = require('../controllers/authentication'),
    UserController = require('../controllers/users'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/ra',function (res,req) {
    console.log('Entered') ;

});
/*router.get('/find', requireAuth, function(req, res){
    res.send({ content: 'Success'});
});*/
router.post('/find',requireAuth , UserController.findUser);




// Set up routes

module.exports = router;

