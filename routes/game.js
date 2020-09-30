const { json } = require('body-parser');

const express       = require('express'),
      router        = express.Router();



module.exports = function(io){
const MAX_GAMES = 10;
const MAX_PLAYER = 6;
const ID_LENGTH = 5;

var games = {};

router.get('/:id', function(req, res){
    var id = req.params.id;
    if(!games[id]){
        req.flash('error', 'Game not found.');
        return res.redirect('/');
    }
    if(!req.session.username){
        req.flash('error', 'Please enter a username first.');
        return res.redirect('/');
    }
    
    //TODO send player names in this lobby
    return res.render('game/lobby', {id: id});
});

router.post('/', function(req, res){
    var action = req.body.action;

    if(req.body.name === null || req.body.name === ""){
        req.flash("error", "Please enter a name.");
        return res.redirect("/");
    }

    req.session.username = req.body.name;

    //Join game
    if(action === "join"){
        var id = req.body.code;
        if(!games[id] || games[id] == undefined){
            req.flash('error', 'Game not found.');
            return res.redirect('/');
        }
        var game = games[id];
        game.players.push(req.session.id);

        
        if(game.players.length >= game.maxPlayers){
            req.flash('error', "Game is full.");
            return res.redirect('/');
        }
        req.session.gameid = id;
        return res.redirect('/game/' + id);
        
    }

    //Host game
    else if(action === "host"){
        // If there are no more game slots, we want to return.
        if(Object.keys(games).length >= MAX_GAMES){
            req.flash("error", "There are currently no more game slots. Try again later");
            return res.redirect('/');
        }

        id = makeid(5);
        req.session.gameid = id;
        games[id] = new Game(req.session.id);
        req.flash('success', `Created game with id <b>${id}</b>.`);
        return res.redirect('/game/' + id);
    }

    //Error
    else{
        req.flash('error', 'Something went wrong');
        return res.redirect('/');
    }

});


//Constructors
function Game(hostId){
    this.admin = hostId;
    this.players = [];
    this.players[0] = hostId;
    this.maxPlayers = MAX_PLAYER;
    this.status = GAMESTATUS.LOBBY;
}


//Helpers
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 var clients = {};

 //Socket.io
 io.on('connection', (socket) => {
    socket.on('new user', (user) => {
        socket.join(user.gameid);
        clients[socket.id] = user;
        io.to(user.gameid).emit('connect message', {username: user.username, connected: true});
    });

    socket.on('disconnect', () => {
      var user = clients[socket.id];
      if(!user || user == undefined) return;
      io.to(user.gameid).emit('connect message', {username: user.username, connected: false});
      clients[socket.id] == null;
    });

    socket.on('lobby message', (msg) =>{
        io.to(msg.gameid).emit('lobby message', msg);
    });
});

const GAMESTATUS = {
    LOBBY: 0,
    LIVE: 1,
    ENDED: 2
}

return router;
};