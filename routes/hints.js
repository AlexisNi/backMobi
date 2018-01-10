
var hintsController=require('../controllers/hints');
express = require('express'),
  passportService = require('../config/passport'),
  passport = require('passport');
var middleware = require('../config/firebaseMiddleware')

var requireAuth = passport.authenticate('jwt', {session: false});
var router=express.Router();





router.post('/use', middleware,hintsController.useHint);
router.post('/check', middleware,hintsController.checkIfHintsIsActive);







module.exports = router;