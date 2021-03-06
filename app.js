var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();
var cors=require('cors');
var config= require('./config/config.js');
var compression = require('compression');
var helmet = require('helmet');
var checkIfIsActiveDaemon= require('./controllers/hints').checkIfActiveDaemon();

////////////////Node js fireBase////////////////////
var admin = require("firebase-admin");
var serviceAccount = require("./config/football-quiz-a9e1e-firebase-adminsdk-huyqg-1f82e47ba0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://football-quiz-a9e1e.firebaseio.com"
});
var adminControl= require("./config/firebaseMiddleware");


///////////////////routes config////////////////////
var authethenticationRoute=require('./routes/authentication');
var userRoutes=require('./routes/user');
var arenaRoutes=require('./routes/arenas');
var activeArena=require('./routes/activeArena');
var awards=require('./routes/awards');
var firebaseRoutes=require('./routes/firebaseAuth');
var historicDataRoutes=require('./routes/historicData');
var leaderBoardRoutes=require('./routes/leaderBoard');
var hintsRoutes=require('./routes/hints');
var googlePlayGameRoutes=require('./routes/googlePlayGameServices');



require('./controllers/leaderboard').leaderBoardCreate();
setInterval(function () {
  require('./controllers/leaderboard').leaderBoardCreate();
},600000);

///////////////socket config//////////////////
var mongoAdapter = require('socket.io-adapter-mongo');
var socket_io=require("socket.io");
var io=socket_io();
app.io=io;

io.adapter(mongoAdapter('mongodb://Alexis:315551@ds153689.mlab.com:53689/footballquizarena' ));

var sockets=require('./sockets/socket')(io);
///////////////database//////////////////
mongoose.connect(  'Alexis:315551@ds153689.mlab.com:53689/footballquizarena');
// view engine setup
app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});*/


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/api/gpgs',googlePlayGameRoutes)
app.use('/api/auth',authethenticationRoute);
app.use('/api/users',userRoutes);
app.use('/api/arenas',arenaRoutes);
app.use('/api/activeArena',activeArena);
app.use('/api/awards',awards);
app.use('/api/firebase',firebaseRoutes);
app.use('/api/historicData',historicDataRoutes);
app.use('/api/leaderBoard',leaderBoardRoutes);
app.use('/api/hints',hintsRoutes);


app.use(function (req, res, next) {
  return res.render('index',{title:'Express and port listeninig is'+process.env.PORT });
});


module.exports = app;
