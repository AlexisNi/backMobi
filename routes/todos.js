/**
 * Created by alex on 16/02/2017.
 */
var AuthenticationController = require('../controllers/authentication'),
    TodoController = require('../controllers/todos'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
var router=express.Router();



    // Todo Routes

router.post('/ra',function (res,req) {
    console.log('Entered') ;
});
    router.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), TodoController.getTodos);
    router.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), TodoController.createTodo);
    router.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), TodoController.deleteTodo);

    // Set up routes

module.exports = router;

