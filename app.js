const express       = require("express"),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      flash         = require('connect-flash'),
      server        = require('http').createServer(app);


const indexRoutes   = require('./routes/index.js');
const gameRoutes    = require('./routes/game.js');

require('dotenv').config({path: __dirname + '/.env'});

app.use(require('express-session')({
    secret: process.env.SECRET || "Gzuz mir gehts gut jetzt",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(function(req, res, next){
    // res.locals.currentUserJSON = JSON.stringify(req.user);
    // res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//Requiring routes
app.use(indexRoutes);
app.use('/game', gameRoutes);

//TODO Database connection

//TODO Setup express session


//Listening on port
var port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Server has started on Port ' + port + ' in environment: ' + process.env.NODE_ENV);
    
});