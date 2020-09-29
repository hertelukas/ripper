const express       = require("express"),
      app           = express(),
      server        = require('http').createServer(app),
      io            = require('socket.io').listen(server),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      flash         = require('connect-flash');

const indexRoutes   = require('./routes/index.js');

require('dotenv').config({path: __dirname + '/.env'});

app.use(require('express-session')({
    secret: process.env.SECRET || "Gzuz mir gehts gut jetzt",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
    // res.locals.currentUserJSON = JSON.stringify(req.user);
    // res.locals.currentUser = req.user;
    // res.locals.error = req.flash('error');
    // res.locals.success = req.flash('success');
    next();
});

//Requiring routes
app.use(indexRoutes);

//TODO Database connection

//TODO Setup express session

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(flash());


//Listening on port
var port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Server has started on Port ' + port + ' in environment: ' + process.env.NODE_ENV);
    
});