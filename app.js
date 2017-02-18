var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();
var cors=require('cors');

///////////////////routes config////////////////////
var todosRoutes=require('./routes/todos')
var authethenticationRoute=require('./routes/authentication');

///////////////socket config//////////////////
var socket_io=require("socket.io");
var io=socket_io();
app.io=io;
var sockets=require('./sockets/socket')(io);
///////////////database//////////////////
mongoose.connect(  'Alexis:315551@ds153689.mlab.com:53689/footballquizarena');
// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use('/api/auth',authethenticationRoute);
app.use('/api/todos',todosRoutes);

app.use(function (req, res, next) {
    return res.render('index');
});


module.exports = app;
