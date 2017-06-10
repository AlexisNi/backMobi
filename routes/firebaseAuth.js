/**
 * Created by alexn on 28/05/2017.
 */
var express = require('express'),
  router = express.Router()

var firebaseController = require('../controllers/firebase')
var userController = require('../controllers/user')
var middleware = require('../config/firebaseMiddleware')

router.post('/', middleware, firebaseController.checkAuth)
router.post('/devToken', firebaseController.checkAuth)
router.post('/checkuser', middleware, userController.userCheck)
router.post('/createUser', userController.userCreate)

router.get('/protected', middleware, function (req, res) {
  return res.status(200).json(
    {
      content: 'Success',
      user_id:req.body.uid
    }
  )

})

module.exports = router
