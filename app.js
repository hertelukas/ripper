const express       = require("express"),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      flash         = require('connect-flash'),
      server        = require('http').createServer(app),
      io            = require('socket.io')(server),
      session       = require('express-session'),
      MongoStore    = require('connect-mongo')(session);


const indexRoutes   = require('./routes/index.js');
const gameRoutes    = require('./routes/game.js')(io);

const db = process.env.DATABASE_URL || 'mongodb://localhost:27017/ripper';
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
const connection = mongoose.createConnection(db, dbOptions);

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

require('dotenv').config({path: __dirname + '/.env'});

app.use(session({
    secret: process.env.SECRET || "Change me!",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie:{
        maxAge: 1000 * 60 * 60 * 12 //12 hours
    }
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentSession = req.session;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//Requiring routes
app.use(indexRoutes);
app.use('/game', gameRoutes);

//TODO Database connection

//Listening on port
var port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Server has started on Port ' + port + ' in environment: ' + process.env.NODE_ENV);
});