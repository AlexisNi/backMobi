var express = require('express');
var router=express.Router();
var firebaseController = require('../controllers/firebase')
var middleware = require('../config/firebaseMiddleware')
var UserController = require('../controllers/user')

router.post('/ra',function (res,req) {
    console.log('Entered') ;

});
/*router.get('/find', requireAuth, function(req, res){
    res.send({ content: 'Success'});
});*/
router.post('/find',middleware , UserController.findUser);




// Set up routes

module.exports = router;

